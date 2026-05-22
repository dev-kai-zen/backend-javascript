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
| `models.register.js` | `registerModels()` (+ `modelLoadDependencies` if needed) |
| `routes.register.js` | `registerV1Routes(v1Router)` |

**Request flow:** `Route → Controller → Service → Repository`

**Cross-module calls:** use the other module’s **service**, never its repository.

**Responses:** always use `sendSuccess`, `sendError`, or `sendValidationError` from `src/shared/http/api-response.js`.

---

## Auth and RBAC

- Do **not** add global JWT on `/api/v1` unless the whole tree must be private.
- Put **`authenticateJwt`** on routes (or mount it in `routes.register.js` for that module).
- Put **`routesGuard`** with `roles` and/or `permissions` on routes that need RBAC.
- Permission codes live in `src/shared/constants/permissions.contant.js` (and DB seed catalog).

JWT alone does **not** enforce permissions — you must add `routesGuard` explicitly.

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
