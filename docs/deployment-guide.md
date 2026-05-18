# Deployment Guide (Docker) — For Junior Developers

This guide explains how to run the **backend-typescript** API and **MySQL** with Docker Compose using a **production-style workflow**: **database migrations are a separate, explicit step** from starting the API container. That matches how many teams deploy: migrate once (or via a job), then roll out new app containers.

**What you already have in this repo**

- `docker-compose.yml` — defines the **`db`** (MySQL) and **`api`** services.
- `Dockerfile` — builds a production-style image (compile TypeScript, run `node dist/index.js`).
- `docker/entrypoint.sh` — starts the API; runs migrations **only** if you set `RUN_MIGRATIONS_ON_START=true` **or** if you invoke the **`migrate`** command (see below).

**Why this matters:** if every API replica ran migrations on boot in production, several instances could try to change the schema at the same time and cause confusing failures or locks. Teams usually **run migrations deliberately** (CI, release script, or one-off container) **before** or **as part of** a controlled deploy.

---

## Table of contents

Section titles below are plain text (not clickable links), so Markdown preview will not try to open paths or fragments. Use your editor’s **Outline** view or scroll to jump to a section.

1. Vocabulary — image, container, service, volume  
2. Do I migrate **before** or **after** rebuilding the API?  
3. What happens on a fresh machine (first-time setup)  
4. Day-to-day: start the stack without auto-migrate (production-style)  
5. Rebuilding the API image after code changes  
6. Running migrations explicitly (`migrate` command)  
7. Inspecting migration status and rolling back (careful)  
8. Environment variables and secrets  
9. Ports and connecting from your host (MySQL client)  
10. Stopping the stack and resetting the database  
11. Optional: auto-migrate on API start (local convenience only)  
12. Troubleshooting  
13. Golden rules  

---

## 1. Vocabulary — image, container, service, volume

| Term | Plain English |
|------|----------------|
| **Image** | A **snapshot** of your app and its filesystem (built from the `Dockerfile`). Think “installable package.” |
| **Container** | A **running instance** of an image. You can stop it, delete it, and start another from the same image. |
| **Service** | In Compose, a **named recipe** (`db`, `api`) that says which image to use, env vars, ports, and dependencies. |
| **Volume** | A **named disk** Docker keeps for you. Here, **`mysql_data`** stores MySQL’s files so data survives container restarts. |

**Why this matters:** when someone says “rebuild the API,” they usually mean **build a new image** (new code baked in), then **recreate the API container** from that image. The database volume is separate unless you delete it on purpose.

---

## 2. Do I migrate **before** or **after** rebuilding the API?

**Short answer:** for the workflow this repo encourages, run migrations **when you deploy a version of the code that needs a new schema** — typically **before** you rely on the new code against the database, and **before** (or at the start of) rolling out containers that **expect** the new tables/columns.

**Slightly longer answer (how teams think about it)**

| Situation | Typical order |
|-----------|----------------|
| **Migration adds a new table/column the new API code *requires*** | Run **migrations first**, then deploy/restart the **new** API (or migrate and immediately roll traffic to new version). |
| **Migration only adds optional things** (e.g. nullable column) and old code still works | Order is more flexible, but teams still **plan** “migrate, then deploy” so production is predictable. |
| **You only changed API code, no new migrations** | Rebuild/restart the **API** only. **No** migration step needed. |
| **You added new migration files** | After pulling/building that commit, run **`db:migrate`** (or `docker compose … migrate`) **against the same database** the API will use. |

**Common junior mistake:** deploying API code that **reads a new column** before the column exists → SQL errors at runtime. The safe habit: **migration matches the code you deploy**; apply migration **as part of** that deploy, not “whenever you remember.”

---

## 3. What happens on a fresh machine (first-time setup)

### Goal

MySQL is running with an empty database **name** created by Compose, your **schema** is applied via Sequelize migrations, then the API starts and can connect.

### Preconditions

- **Docker** and **Docker Compose** installed (on WSL/Linux: Docker Engine or Docker Desktop with WSL integration, depending on your setup).
- Terminal open at the **backend-typescript** repo root (where `docker-compose.yml` lives).

### Steps (production-style — explicit migrate)

**Step 1 — Start only the database (optional but clear)**

```bash
docker compose up -d db
```

**What this does:** downloads the MySQL image if needed, starts **`backend-ts-mysql`**, creates the **`mysql_data`** volume, exposes **host port `3307` → container `3306`**.

**Why `-d`:** runs in the **background** (“detached”) so your terminal stays free.

**Step 2 — Wait until MySQL is healthy**

```bash
docker compose ps
```

Wait until **`backend-ts-mysql`** shows **(healthy)** in the `STATUS` column (Compose runs a healthcheck). The API service is configured to wait for that health before starting, but **manual migrate** still needs a live DB.

**Step 3 — Build the API image (first time or after code changes)**

```bash
docker compose build api
```

**What this does:** runs the **`Dockerfile`**: `npm ci`, `npm run build` (`tsc`), prepares the runtime image with `dist/`, `database/`, and `sequelize-cli`.

**Step 4 — Run migrations **once** against that database**

```bash
docker compose run --rm api migrate
```

**What each part means**

- **`docker compose run`** — start a **one-off** container based on the **`api`** service (same env as in `docker-compose.yml`, including **`DATABASE_URL`** pointing at host **`db`**).
- **`--rm`** — remove the container when the command finishes (keeps `docker ps` clean).
- **`api`** — the service name from `docker-compose.yml`.
- **`migrate`** — passed to **`docker/entrypoint.sh`**, which runs **`npx sequelize-cli db:migrate`** and exits (does **not** start the HTTP server).

**Why this is “production-like”:** you chose **when** the schema changes, instead of hiding it inside “container start.”

**Step 5 — Start the API (background)**

```bash
docker compose up -d api
```

**What this does:** starts **`backend-ts-api`** on **port `3000`** (or **`API_PORT`** if you set it in a `.env` file next to `docker-compose.yml`).

**Step 6 — Quick sanity check**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/api-docs.json
```

You should see **`200`** if the server and routing are up (Swagger JSON).

---

## 4. Day-to-day: start the stack without auto-migrate (production-style)

If you already migrated once and only need to turn services on:

```bash
docker compose up -d
```

**What this does:** starts **`db`** and **`api`**. With the default `docker/entrypoint.sh`, the API **does not** run migrations unless `RUN_MIGRATIONS_ON_START=true`.

**If the database volume was wiped** or you’re on a **new migration version** from Git, run **section 6** again before expecting the app to work.

---

## 5. Rebuilding the API image after code changes

### Scenario

You edited TypeScript under `src/` and want the **running container** to use the new code.

### Commands

```bash
docker compose build api
docker compose up -d api
```

**What each step does**

1. **`build api`** — new **image** layer with fresh `dist/` from `tsc`.
2. **`up -d api`** — recreates the **api** container from that image (Compose does this when the image id changed).

**If you did not change migrations:** you **do not** need to run `migrate` again.

**If you pulled commits that include **new files** under `database/migrations/`:** run:

```bash
docker compose run --rm api migrate
```

…**before** or **right after** deploying the new API, following your team’s rule (see **section 2**).

**Why rebuild matters:** a running container **does not** see your laptop’s `src/` folder unless you use a dev setup with bind mounts. The production-style `Dockerfile` **bakes** code into the image at **build** time.

---

## 6. Running migrations explicitly (`migrate` command)

### Apply pending migrations

```bash
docker compose run --rm api migrate
```

**Equivalent (on your host, if you use local Node + `.env` with `DATABASE_URL`)**

```bash
npm run migration:up
```

Both use **`DATABASE_URL`** and **`database/config/database.js`** (Sequelize CLI). **Inside Docker**, Compose sets **`DATABASE_URL`** to reach the **`db`** service; on your laptop, your `.env` might use **`localhost:3307`** instead — **do not mix them up** (one wrong URL migrates a different database).

### Check migration status (host with Node)

```bash
npm run migration:status
```

*(There is no separate `migrate status` wrapper in the entrypoint; use npm on the host or run a shell in the container — see **section 12**.)*

### One mental model

- **`migrate` in Docker** = “run Sequelize CLI **inside** the same image the API runs.”
- **`npm run migration:*`** on the host = “run Sequelize CLI **on your machine**” — must match the **same** DB URL the app will use.

---

## 7. Inspecting migration status and rolling back (careful)

### Status

```bash
npm run migration:status
```

**Why:** shows which migration files are applied. Useful when CI or a teammate says “migration failed.”

### Undo **last** migration (local/dev only unless your team approves)

```bash
npm run migration:down
```

**Warning:** rolling back in **shared** or **production** databases can **delete data** or break apps still expecting the new schema. **Always** confirm with a senior engineer or runbook before using this outside your personal Docker volume.

---

## 8. Environment variables and secrets

Compose reads variables from a **`.env`** file in the **same directory** as `docker-compose.yml` for **substitution** (e.g. `JWT_SECRET`, `API_PORT`).

**Required for the app (set in `docker-compose.yml` or `.env`)**

| Variable | Purpose |
|----------|---------|
| **`DATABASE_URL`** | MySQL connection string. In Compose, overridden to use host **`db`** and app user/password. |
| **`JWT_SECRET`** | Signs session tokens — use a long random string in real environments. |
| **`GOOGLE_CLIENT_ID`** | Google OAuth client (public id; still should match your project). |

**See also:** `env.example` in the repo root.

**Junior rule:** never commit real **secrets** to Git. Use `.env` locally and a secret manager in real production.

---

## 9. Ports and connecting from your host (MySQL client)

| Service | Host port | Inside Compose network |
|---------|-----------|-------------------------|
| MySQL | **`3307`** → container `3306` | host name **`db`**, port **`3306`** |
| API | **`3000`** (or **`API_PORT`**) | **`http://api:3000`** from another container |

**Example:** connect from your laptop with a GUI or CLI using **`127.0.0.1`**, port **`3307`**, user **`boilerplate`** (see `docker-compose.yml`).

---

## 10. Stopping the stack and resetting the database

### Stop containers (keep data)

```bash
docker compose down
```

**What you keep:** the **`mysql_data`** volume — your tables and rows survive.

### Stop and **delete** the MySQL volume (full reset)

```bash
docker compose down -v
```

**Warning:** **`-v`** removes named volumes declared in this compose file. You **lose** local DB data — great for a clean slate; **disastrous** if you thought you were on a shared server (you should not use this compose file for production servers without understanding ops).

After `-v`, repeat **section 3** from **Step 4** (migrate) upward.

---

## 11. Optional: auto-migrate on API start (local convenience only)

If you **personally** want the old “migrate every time the API container starts” behavior **on your laptop**, add to the **`api`** service in `docker-compose.yml`:

```yaml
environment:
  RUN_MIGRATIONS_ON_START: "true"
```

**Why we don’t default this:** it hides the deploy step juniors should learn, and it is a poor default for **multiple** API replicas in real production.

---

## 12. Troubleshooting

### `Error: connect ECONNREFUSED` or migration cannot reach DB

- Is **`db`** running and **healthy**? `docker compose ps`
- Did you use **`db`** as hostname **inside** containers and **`127.0.0.1:3307`** only **from your host**?

### API exits immediately

```bash
docker compose logs api
```

Typical causes: missing env (`JWT_SECRET`, etc.), DB not ready, or migrations not applied so `authenticate()` fails depending on your code path.

### “I ran migrate but API still crashes”

- Confirm you migrated the **same** database URL the API uses (`docker compose config` to print resolved env if needed).
- Run **`npm run migration:status`** against that same URL from the host, or check logs from **`docker compose run --rm api migrate`**.

### Open a shell **inside** the API image (debugging)

```bash
docker compose run --rm --entrypoint sh api
```

Then inside the container:

```bash
npx sequelize-cli db:migrate:status
```

(`DATABASE_URL` must be set — `compose run api` does that.)

---

## 13. Golden rules

- **Treat migrations as part of the release**, not a side effect of “container woke up.”
- **Match migrations to the code version** you deploy; when in doubt, **migrate before** trusting new code against production-like data.
- **Rebuild the API image** when `src/` changes; the container does not auto-sync your editor’s files in this setup.
- **Backup production** before bold schema changes; Docker on your laptop is not a backup strategy.
- **Read `docker compose logs`** when something fails — the message is almost always there.

---

*When in doubt, ask a teammate before running `migration:down` or `compose down -v` against shared data.*
