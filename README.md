# backend-javascript

Express + Sequelize (MySQL) boilerplate with modular routes, RBAC, Google auth, Zod validation, and a shared API response shape.

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp env.example .env
   ```

   Fill in MySQL credentials and secrets. You also need **`DATABASE_URL`** (used by the app and Sequelize CLI), for example:

   ```env
   DATABASE_URL=mysql://USER:PASSWORD@localhost:3307/DB_NAME
   ```

3. **Create the database** (MySQL) using the name from `DB_NAME`, then run migrations:

   ```bash
   npm run migration:up
   ```

   Optional seed data:

   ```bash
   npm run seed:all
   ```

4. **Run the API**

   ```bash
   npm run dev
   ```

   Server listens on `http://localhost:3000` (or `PORT` from `.env`). Routes are mounted under **`/api/v1`**.

5. **Explore the API**

   - Swagger UI: `http://localhost:3000/api-docs`
   - OpenAPI JSON: `http://localhost:3000/api-docs.json`

## Using this boilerplate for a new feature

Add a folder under `src/modules/<your-module>/` with the usual layers:

| File | Role |
|------|------|
| `*.model.js` | Sequelize model |
| `*.repository.js` | DB access only |
| `*.service.js` | Business logic; owns transactions via `withTransaction` |
| `*.schemas.js` | Zod schemas; validate in service with `parseInput` |
| `*.controller.js` | HTTP: call service, return `sendSuccess` / `sendError` / `sendValidationError` |
| `*.routes.js` | Express router |
| `models.register.js` | Export `registerModels()` (and optional `modelLoadDependencies`) |
| `routes.register.js` | Export `registerV1Routes(v1Router)` to mount paths |

The bootstrap discovers every module that has `models.register.js` and `routes.register.js`—no manual wiring in `app.js`.

**Request flow:** `Route → Controller → Service → Repository`

**Responses** (from `src/shared/http/api-response.js`):

```json
{ "status": true|false, "message": "...", "data": ... }
```

## Testing

Tests use **Vitest** and **Supertest** (ES modules). `vitest.setup.js` at the repo root sets minimal env vars so unit tests do not require a running database.

| Command | Purpose |
|---------|---------|
| `npm test` | Run all `*.test.js` and `*.integration.test.js` under `src/` |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:scan` | List source files with / without co-located tests |
| `npm run test:gen` | Scaffold missing `*.test.js` files next to source |

**Layout**

- Co-located tests live **next to** the file they test (e.g. `users.service.js` → `users.service.test.js`)
- Route-level HTTP tests use `*.integration.test.js` (e.g. `test.routes.integration.test.js`)
- `src/test/create-test-app.js` — Express app with all `/api/v1` routes for integration tests
- `src/test/mock-response.js` — minimal `res` mock for controller unit tests

**Examples included:** `api-response`, `parse-input`, `users.schemas`, `users.controller` (mocked service), `test.routes` integration (`/api/v1/test`, `/health`).

See [`docs/how-to-create-test-file.md`](docs/how-to-create-test-file.md) for a step-by-step guide.

## Useful scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start with nodemon |
| `npm test` | Run Vitest test suite |
| `npm run migration:create -- <name>` | New migration (`.cjs` in `database/migrations/`) |
| `npm run migration:up` / `migration:down` | Apply / undo last migration |
| `npm run seed:all` | Run seeders |

More detail: [`docs/db-migrations.md`](docs/db-migrations.md), [`docs/deployment-guide.md`](docs/deployment-guide.md).

## Contributing

Team workflow, PR checklist, and definition of done: [`docs/contributing-guide.md`](docs/contributing-guide.md).

CI runs `npm test` on every push and pull request to `main` (GitHub Actions).

## Architecture

Follow the conventions in your Cursor rules (`backend-javascript-architecture.mdc`): one name per layer, services call other modules’ **services** (not their repositories), transactions via `options.transaction` / `withTransaction`, validation in services with Zod.
