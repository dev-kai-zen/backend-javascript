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

## Useful scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start with nodemon |
| `npm run migration:create -- <name>` | New migration (`.cjs` in `database/migrations/`) |
| `npm run migration:up` / `migration:down` | Apply / undo last migration |
| `npm run seed:all` | Run seeders |

More detail: [`docs/db-migrations.md`](docs/db-migrations.md), [`docs/deployment-guide.md`](docs/deployment-guide.md).

## Architecture

Follow the conventions in your Cursor rules (`backend-javascript-architecture.mdc`): one name per layer, services call other modules’ **services** (not their repositories), transactions via `options.transaction` / `withTransaction`, validation in services with Zod.
