# Database migrations guide

This project uses **Sequelize CLI** with **MySQL**. The app uses **ESM** (`package.json` has `"type": "module"`), so migration files must use the **`.cjs`** extension and **`module.exports`** — plain **`.js`** migrations are parsed as ES modules and `module` is undefined. The CLI reads `DATABASE_URL` from your environment via `database/config/database.cjs`, aligned with the runtime app (`src/config/sequelize-config.js`).

## Prerequisites

1. **MySQL** reachable from your machine.
2. A **`.env`** file in the project root with `DATABASE_URL`, for example:

   ```text
   DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME
   ```

3. Optional: set `SEQUELIZE_LOG_SQL=1` to print SQL while running migrations.

## How the CLI finds your project

| File | Role |
|------|------|
| `.sequelizerc` | Points Sequelize CLI at `database/config/database.cjs`, `database/migrations`, etc. |
| `database/config/database.cjs` | Connection (`url`, `dialect: "mysql"`, `timezone`, `logging`) for `development`, `test`, and `production`. |

Sequelize CLI uses `NODE_ENV` (default **`development`**) to choose which block from `database/config/database.cjs` to use. If you need production, run with `NODE_ENV=production` when invoking the CLI.

## Create a new migration file

Generate a stub (timestamp + name) with npm:

```bash
npm run migration:create -- <short-descriptive-name>
```

**Examples:**

```bash
npm run migration:create -- create-orders
npm run migration:create -- add-status-to-users
npm run migration:create -- create-index-on-audit-timestamp
```

That runs `sequelize-cli migration:generate` and creates a file such as:

`database/migrations/20260512120000-create-orders.cjs` (rename generated `.js` to `.cjs` in this repo)

Open the new file and implement `up` and `down`.

### Anatomy of a migration

Each file exports:

- **`up(queryInterface, Sequelize)`** — apply changes (create table, add column, add index, …).
- **`down(queryInterface, Sequelize)`** — reverse **`up`** as closely as possible (drop what was added, remove columns you added, …).

Use the `Sequelize` **constructor** (second argument) for column types and helpers (e.g. `Sequelize.STRING(255)`, `Sequelize.literal("CURRENT_TIMESTAMP(3)")`).

**Minimal template:**

```javascript
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Apply changes
  },

  async down(queryInterface, Sequelize) {
    // Reverse changes
  },
};
```

**Conventions used in this repo:**

- Table options: `charset: "utf8mb4"`, `collate: "utf8mb4_unicode_ci"` on `createTable` where it makes sense.
- Timestamps: `DATE(3)` with `defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)")` on `created_at` when you want DB defaults to match Sequelize `DATE(3)` models.

See existing files for full examples:

- `database/migrations/20260520100001-create-users.cjs`
- `database/migrations/20260520100013-create-audit-logs.js`

### Application models vs migrations

- **Migrations** own the schema history in Git: tables, columns, indexes, FKs.
- **Sequelize models** in `src/` (for example under `shared/models` or `src/modules/**`) should reflect the **current** schema. After you add or change a table in a migration, update (or add) the corresponding model so the app matches the database.

## Run migrations

| Command | What it does |
|---------|----------------|
| `npm run migration:up` | Run all pending migrations |
| `npm run migration:status` | List which migrations ran (`up`) vs pending (`down`) |
| `npm run migration:down` | Undo the **last** applied migration |
| `npm run migration:down:all` | Undo **all** migrations (destructive; use with care) |

Run from the **repository root** (where `.sequelizerc` lives).

## How to “update” a migration file

### Rule of thumb

- **If the migration has never been applied** anywhere that matters (only your laptop, not committed as “run” to shared/dev/staging/prod): you may **edit that same file** freely, then run `npm run migration:up` (or `migration:down` + `migration:up` locally).
- **If the migration was already applied** on any environment you keep (teammates, staging, production), **do not change** that file’s history in a way that disagrees with what already ran. Instead, **add a new migration** that performs the alteration (add column, new index, alter column, data backfill, etc.). That keeps every environment’s `SequelizeMeta` row sequence consistent with the files in `database/migrations/`.

Changing an old migration after it has run elsewhere usually causes **checksum / ordering confusion**, failed deploys, or divergent schemas.

### Safe workflow when you need to fix schema after a mistake

1. **Create a new migration** that fixes forward:

   ```bash
   npm run migration:create -- fix-users-email-length
   ```

2. In `up`, apply the real change (e.g. `changeColumn`, `addColumn`, `addIndex`). In `down`, reverse it.

3. Run `npm run migration:up` and commit the new file only.

### Local-only: edit the last migration and re-run

Only when **no one else** has run that migration:

1. `npm run migration:down` — removes the last migration’s effects **and** the last entry in `SequelizeMeta`.
2. Edit the migration file.
3. `npm run migration:up` — reapplies it.

If you already ran **multiple** migrations after the one you want to change, you must either undo back to that point (`migration:down` repeatedly) or **prefer adding a new migration** instead of rewinding shared history.

### Renaming or replacing migration files

Avoid renaming or deleting migration files that have already been applied on any database: Sequelize tracks migrations by **filename** in the `SequelizeMeta` table. Renames can make the CLI think old migrations are missing or new files are “pending” incorrectly.

## Seeds (optional)

Seed scripts live under `database/seeders/` (if you add them). This project exposes:

- `npm run seed:all`
- `npm run seed:undo:all`

They use the same `database/config/database.cjs` and `DATABASE_URL`.

## Troubleshooting

- **`DATABASE_URL is not set`** — Ensure `.env` exists at the project root and you run commands from that root, or export `DATABASE_URL` in the shell.
- **Permission / connection errors** — Check MySQL user, host, firewall, and database name in the URL.
- **“ER_DUP_FIELDNAME” / duplicate object** — `up` was partially applied or run twice; inspect the DB and adjust the migration or fix the DB manually, then align `SequelizeMeta` only if you know what you are doing.

## Quick reference

```bash
# New migration
npm run migration:create -- my-change-name

# Apply / inspect / roll back
npm run migration:up
npm run migration:status
npm run migration:down
```

For Sequelize’s `queryInterface` API (methods like `createTable`, `addColumn`, `removeColumn`, `addIndex`, `changeColumn`), see the official Sequelize documentation for your installed Sequelize major version.
