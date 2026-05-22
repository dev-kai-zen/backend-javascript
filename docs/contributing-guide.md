# Contributing guide

How we work on **backend-javascript** as a team. Use this checklist on every feature and in PR reviews.

**Related docs:** [How to create a test file](how-to-create-test-file.md) · [DB migrations](db-migrations.md) · [Deployment (Docker)](deployment-guide.md)

---

## Before you open a PR

Run locally from the repo root:

```bash
npm test
```

CI runs the same command on every push and pull request to `main` (see `.github/workflows/ci.yml`). **Do not merge if tests are red.**

Optional while developing:

```bash
npm run test:watch
npm run test:scan    # see which files still lack tests
```

---

## Module checklist (required for new or changed features)

Add or update a folder under `src/modules/<your-module>/` with these layers:

| File | Responsibility |
|------|----------------|
| `*.model.js` | Sequelize model |
| `*.repository.js` | Database access only |
| `*.service.js` | Business logic; `parseInput` + Zod; `withTransaction` when writing |
| `*.schemas.js` | Zod schemas (no HTTP here) |
| `*.controller.js` | HTTP only; wrap handlers with `asyncHandler` |
| `*.routes.js` | Express routes |
| `*.permissions.js` | Permission **codes** for `routesGuard` (strings must match DB seed + JWT) |
| `models.register.js` | `registerModels()` (+ `modelLoadDependencies` if needed) |
| `routes.register.js` | `registerV1Routes(v1Router)` |

**Request flow:** `Route → Controller → Service → Repository`

**Cross-module calls:** use the other module’s **service**, never its repository.

**Responses:** always use `sendSuccess`, `sendError`, or `sendValidationError` from `src/shared/http/api-response.js`.

---

## Auth and RBAC

- Do **not** add global JWT on `/api/v1` unless the whole tree must be private.
- Put **`authenticateJwt`** on the module in `routes.register.js` (e.g. `v1Router.use("/users", authenticateJwt, usersRoutes)`).
- Put **`routesGuard`** on individual routes in `*.routes.js` that need authorization.

JWT alone does **not** enforce permissions — you must add `routesGuard` explicitly.

### Where permission codes live

Use a **module-local** `*.permissions.js` file — not a single global file for every module:

| Module | File | Example export |
|--------|------|----------------|
| Users | `users/users.permissions.js` | `USERS.READ` → `"users:read"` |
| User logs | `user-logs/user-logs.permissions.js` | `USER_LOGS_PERMISSIONS` |
| Audit logs | `audit-logs/audit-logs.permissions.js` | `AUDIT_LOGS_PERMISSIONS` |
| RBAC tree | `rbac/rbac.permissions.js` | `RBAC_ROLES`, `RBAC_PERMISSIONS`, … |

In `*.routes.js`, import from that file and pass codes to `routesGuard`:

```js
import { USERS } from "./users.permissions.js";
import routesGuard from "../../shared/middlewares/routes-guard.js";

usersRoutes.get("/", routesGuard({ permissions: [USERS.READ], source: "token" }), ...);
```

**Roles** (role names, not permission codes) stay in `src/shared/constants/roles.constant.js`.

**Database seed:** when you add a new permission code, add the **same string** to `database/seed-data/rbac-permission-seed-catalog.js` so JWT claims and `routesGuard` agree. If the route checks `users:read` but the DB only has `user_management:read`, every guarded request returns **403**.

### Rate limiting

- **Global:** `apiRateLimiter` on all `/api/v1` traffic is applied once in `src/config/middleware-config.js`. You usually **do not** mount `apiRateLimiter` again in `routes.register.js` for the same paths (that would run two limiters per request).
- **Stricter auth routes:** use `authRateLimiter` on login/logout (see `google-auth.routes.js`). That stacks with the global limiter by design.

---

## Validation

- Define schemas in `*.schemas.js`.
- Validate in the **service** with `parseInput` (throws `ValidationError` → HTTP **400** via `asyncHandler`).
- Controllers may validate route params (e.g. numeric `id`) with `sendValidationError` before calling the service.

---

## Database

- New tables/columns: add a migration under `database/migrations/` (`.cjs`).
- Run `npm run migration:up` locally before relying on new schema.
- Do not edit applied migrations in shared environments — add a new migration instead.

---

## Tests (definition of done)

| Change | Minimum tests |
|--------|-----------------|
| New service logic | Co-located `*.service.test.js` (mock repository) |
| New/changed routes | `*.integration.test.js` with `createTestApp()` + Supertest |
| Shared utility | Co-located `*.test.js` next to the source file |

Co-located layout: `users.service.js` → `users.service.test.js` in the same folder.

Scaffold missing unit tests: `npm run test:gen` (review generated stubs before committing).

---

## OpenAPI / Swagger

When you add or change HTTP routes, update the module’s `*-routes.openapi.js` (or `*.openapi.js`) so `/api-docs` stays accurate.

---

## PR review checklist (reviewer)

- [ ] `npm test` passes (CI green)
- [ ] Layering respected (no repository calls across modules)
- [ ] Auth/RBAC applied where required
- [ ] Migrations included if schema changed
- [ ] Tests added or updated for behavior changes
- [ ] OpenAPI updated for route changes
- [ ] No secrets in code (use `.env`, see `env.example`)

---

## Module ownership (suggested for 6 devs)

Split work by folder under `src/modules/` to reduce merge conflicts:

- Example: Dev A — `users`, `user-logs`; Dev B — `rbac/*`; Dev C — `audit-logs`, `refresh-token`, etc.

Bootstrap auto-discovers `models.register.js` and `routes.register.js` — no need to edit `app.js` for new modules.

---

## Golden rules

1. **Migrations are part of the release** — run them deliberately, not only “when the container starts” (see [deployment-guide.md](deployment-guide.md)).
2. **Keep `main` green** — fix or revert failing tests before merging.
3. **Match the module template** — copy an existing module (e.g. `users`) rather than inventing a new structure.
4. **Ask before destructive DB ops** — `migration:down` and `docker compose down -v` on shared data.
