# How to create a test file (junior guide)

This guide explains how to add automated tests in this backend boilerplate. You do **not** need a running database for most unit tests.

**Tools used:** [Vitest](https://vitest.dev/) (test runner) and [Supertest](https://github.com/ladjs/supertest) (HTTP requests against Express).

**Request flow in this repo:** `Route → Controller → Service → Repository`

---

## 1. What is a test?

A test is a small program that checks your real code behaves as you expect.

- You call a function (or hit an API route).
- You **assert** the result (e.g. “returns 200”, “throws on invalid email”).
- You run all tests with `npm test`. If any assertion fails, the command exits with an error so you catch bugs before deploy.

**Goal:** When you change code later, tests tell you quickly if something broke.

---

## 2. Before you start

From the project root:

```bash
npm install   # once
npm test      # run all tests
```

While writing tests:

```bash
npm run test:watch   # re-runs when you save files
```

Run **one file** only (faster while you work):

```bash
npm test -- src/modules/users/users.schemas.test.js
```

You do **not** need a `.env` file for unit tests. `vitest.setup.js` at the repo root sets fake values for `DATABASE_URL`, `JWT_SECRET`, etc.

---

## 3. Where to put the file

| What you are testing | Where to create the file | Example |
|----------------------|---------------------------|---------|
| Schema, service, controller | **Next to** the source file | `users.schemas.js` → `users.schemas.test.js` |
| Full HTTP route (GET/POST + status + JSON) | **Next to** the routes file | `test.routes.js` → `test.routes.integration.test.js` |
| Shared code under `src/shared/` | Next to that file | `api-response.js` → `api-response.test.js` |

### File name rules

Vitest automatically finds files under `src/` that end with:

| Suffix | Use for |
|--------|---------|
| `.test.js` | Unit tests (schemas, services, controllers with mocks) |
| `.integration.test.js` | HTTP tests with Supertest |

Examples:

- ✅ `users.schemas.test.js`
- ✅ `refresh-token.controller.test.js`
- ✅ `test.routes.integration.test.js`
- ❌ `users.test.js` (Vitest will not pick it up)
- ❌ `test.js`

Config: `vitest.config.js`.

### Shared test utilities

These are **not** production code. Import them from your test file with a relative path.

| File | Use |
|------|-----|
| `src/test/mock-response.js` | `createMockResponse()` — fake Express `res` for controller tests |
| `src/test/create-test-app.js` | `createTestApp()` — full Express app for integration tests |

Example import from `src/modules/users/users.controller.test.js`:

```js
import { createMockResponse } from "../../test/mock-response.js";
```

---

## 4. Minimum template (copy and adapt)

Create a file next to what you test, for example `src/modules/users/users.schemas.test.js`:

```js
import { describe, expect, it } from "vitest";

import { createUserBodySchema } from "./users.schemas.js";

describe("users.schemas", () => {
  it("accepts a valid email", () => {
    const parsed = createUserBodySchema.parse({
      email: "user@example.com",
    });

    expect(parsed.email).toBe("user@example.com");
  });
});
```

### The three building blocks

| Piece | Meaning |
|-------|---------|
| `describe("name", () => { ... })` | Groups related tests (one schema, one controller function, one route). |
| `it("what should happen", () => { ... })` | **One** behavior. Name it like a sentence: `"rejects missing email"`. |
| `expect(value).toBe(...)` | Check the result. If it is wrong, the test fails. |

### Imports you need

Always import test helpers from Vitest:

```js
import { describe, expect, it } from "vitest";
```

Import the **real code** you test with a relative path and **`.js` extension** (this project uses native ESM):

```js
import { createUserBodySchema } from "./users.schemas.js";
```

---

## 5. Your first test (recommended): Zod schemas

**Why start here:** Schemas only validate JSON shapes. No database, no HTTP, no mocks.

**File to copy from:** `src/modules/users/users.schemas.test.js`

### Happy path (valid input)

```js
it("accepts a minimal valid body", () => {
  const parsed = createUserBodySchema.parse({
    email: "user@example.com",
  });

  expect(parsed.email).toBe("user@example.com");
  expect(parsed.is_active).toBe(true);
});
```

### Sad path (invalid input)

With `.parse()`, invalid input **throws**. Use `expect(() => ...).toThrow()`:

```js
it("rejects invalid email", () => {
  expect(() =>
    createUserBodySchema.parse({ email: "not-valid" }),
  ).toThrow();
});
```

Optional: check the error message:

```js
expect(() =>
  createUserBodySchema.parse({ email: "not-valid" }),
).toThrow(/email/i);
```

### Several cases at once (`it.each`)

```js
it.each(["", "   ", "not-an-email"])("rejects bad email (%j)", (email) => {
  expect(() => createUserBodySchema.parse({ email })).toThrow();
});
```

---

## 6. Common `expect` matchers

```js
expect(1 + 1).toBe(2);                    // strict equality
expect({ a: 1 }).toEqual({ a: 1 });       // deep equality (objects/arrays)
expect(result).toBeNull();
expect("hello world").toMatch(/world/);   // regex on strings
expect(() => fn()).toThrow();             // function must throw
expect(() => fn()).toThrow(/some message/i);
expect(mockFn).not.toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(42);
```

For controller tests (mock `res`):

```js
expect(res.statusCode).toBe(400);
expect(res.body).toMatchObject({
  status: false,
  message: "invalid id",
});
```

For API responses (integration tests):

```js
expect(response.status).toBe(200);
expect(response.body).toMatchObject({
  status: true,
  message: "backend-javascript APIs",
});
```

---

## 7. What to test (easiest → harder)

Work through this order as you learn.

### Level 1 — Schemas and pure helpers (start here)

**Examples in repo:**

- `src/modules/users/users.schemas.test.js`
- `src/modules/refresh-token/refresh-token.schemas.test.js`
- `src/shared/validation/parse-input.test.js`
- `src/shared/http/api-response.test.js`

**Test:** Valid input passes, invalid input fails, edge cases (empty string, wrong type).

---

### Level 2 — Pure service logic (no database)

Some service functions do not call the repository (e.g. parsing query params).

**Example in repo:** `src/modules/refresh-token/refresh-token.service.test.js` (`parseListFilters`)

```js
import { describe, expect, it } from "vitest";

import { parseListFilters } from "./refresh-token.service.js";

describe("parseListFilters", () => {
  it("returns {} when userId is omitted", () => {
    expect(parseListFilters(undefined)).toEqual({});
  });

  it("parses userId from string", () => {
    expect(parseListFilters("42")).toEqual({ userId: 42 });
  });
});
```

---

### Level 3 — Services that use the repository (mock the repository)

When a service calls `users.repository.js`, mock the repository so no real MySQL is used.

Create `src/modules/users/users.service.test.js`:

```js
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as usersRepository from "./users.repository.js";
import { getUserById } from "./users.service.js";

vi.mock("./users.repository.js");

describe("getUserById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the user when the repository finds one", async () => {
    const fakeUser = { id: 1, email: "a@b.com" };
    vi.mocked(usersRepository.getUserById).mockResolvedValue(fakeUser);

    const result = await getUserById(1);

    expect(result).toEqual(fakeUser);
    expect(usersRepository.getUserById).toHaveBeenCalledWith(1);
  });

  it("returns null when the repository finds nothing", async () => {
    vi.mocked(usersRepository.getUserById).mockResolvedValue(null);

    const result = await getUserById(999);

    expect(result).toBeNull();
  });
});
```

**Idea:** You test **your** service logic; the mock pretends the DB returned whatever you need.

---

### Level 4 — Controllers (mock the service)

Controllers read `req`, call the service, and send JSON via `sendSuccess` / `sendError`. Do **not** hit the real service or database.

**Example in repo:** `src/modules/users/users.controller.test.js`

```js
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockResponse } from "../../test/mock-response.js";

const { getUserById } = vi.hoisted(() => ({
  getUserById: vi.fn(),
}));

vi.mock("./users.service.js", () => ({
  createUser: vi.fn(),
  getUsers: vi.fn(),
  getUserById,
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

const { getUserById: getUserByIdHandler } = await import("./users.controller.js");

describe("users.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserById returns 400 when id is invalid", async () => {
    const res = createMockResponse();
    await getUserByIdHandler({ params: { id: "abc" } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("invalid id");
    expect(getUserById).not.toHaveBeenCalled();
  });
});
```

**Important:**

1. Use `vi.hoisted()` so mock functions exist before `vi.mock`.
2. Mock **every** export the controller imports from `./users.service.js`.
3. `await import("./users.controller.js")` **after** `vi.mock`.
4. Use `createMockResponse()` instead of a real Express `res`.

**Copy from:** `src/modules/refresh-token/refresh-token.controller.test.js` for another full example.

---

### Level 5 — HTTP routes (integration)

You send real HTTP requests to the Express app and check status + JSON.

**Example in repo:** `src/modules/test/test.routes.integration.test.js`

```js
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { createTestApp } from "../../test/create-test-app.js";

describe("test.routes integration", () => {
  let app;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it("GET /api/v1/test/health returns 200", async () => {
    const response = await request(app).get("/api/v1/test/health");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ healthy: true });
  });
});
```

`createTestApp()` loads **all** modules registered under `/api/v1`. Use the real path from your `*.routes.js` and `routes.register.js`.

**Note:** Routes that use `authenticateJwt` or load users from the DB need a valid JWT and/or test data (or more mocking). Start with **public** routes (health, invalid id → 400).

---

## 8. Step-by-step checklist for a new test file

1. Decide **what** you test (schema? pure service? controller? route?).
2. Create the file **next to** the source:
   - `something.test.js` for unit tests
   - `something.integration.test.js` for HTTP tests
3. Add imports: `describe`, `expect`, `it` from `vitest`, plus your module (with `.js`).
4. Add one `describe` block named after the unit.
5. Add one `it` for the **happy path** — run `npm test` and make sure it passes.
6. Add `it` blocks for **sad paths** (invalid input, not found, unauthorized).
7. Run `npm run test:watch` while you edit.

### Scaffold stubs (optional)

```bash
npm run test:scan    # list source files with / without a co-located test
npm run test:gen     # create stub *.test.js next to untested source files
```

Replace `// TODO` in generated stubs with real assertions.

---

## 9. Good test names and habits

**Do:**

- One behavior per `it` (one reason to fail).
- Name tests as sentences: `"rejects email without @"`, not `"test1"`.
- Test behavior users care about, not implementation details.
- In controller tests, mock the **service**, not the repository (controller should not import repositories).

**Avoid:**

- Tests that depend on order (test A must run before test B).
- Hitting a real production database in unit tests.
- Giant tests that assert ten unrelated things.

---

## 10. Troubleshooting

| Problem | What to do |
|---------|------------|
| `No test files found` | File must end with `.test.js` or `.integration.test.js` and live under `src/`. |
| `Cannot find module` | Fix the import path; use `./users.schemas.js` from the same folder and `.js` extension. |
| Test fails but app “works” in Postman | Test might expect different input — read Vitest **Expected** vs **Received**. |
| `vi.mock` does not work | Put `vi.mock` before `await import("./your.controller.js")`; use `vi.hoisted` for mock fns. |
| Controller test hits real DB | You forgot `vi.mock("./your.service.js")`. |
| Service test hits real DB | Add `vi.mock("./your.repository.js")`. |
| Need env vars | Rely on `vitest.setup.js`; do not commit secrets for tests. |

When a test fails, Vitest prints **Expected** vs **Received** — read that diff first.

---

## 11. Example files in this repo (read these)

| Topic | File |
|-------|------|
| Zod schemas | `src/modules/users/users.schemas.test.js` |
| Pure service helper | `src/modules/refresh-token/refresh-token.service.test.js` |
| Controller + mocked service | `src/modules/users/users.controller.test.js` |
| Controller (another module) | `src/modules/refresh-token/refresh-token.controller.test.js` |
| `parseInput` + Zod | `src/shared/validation/parse-input.test.js` |
| API response helpers | `src/shared/http/api-response.test.js` |
| HTTP integration | `src/modules/test/test.routes.integration.test.js` |
| Mock Express `res` | `src/test/mock-response.js` |
| Test Express app | `src/test/create-test-app.js` |
| Test env setup | `vitest.setup.js` |
| Vitest config | `vitest.config.js` |

---

## 12. Quick reference

```bash
npm test                                                    # all tests
npm run test:watch                                          # watch mode
npm test -- src/modules/users/users.schemas.test.js         # one file
npm run test:scan                                           # coverage scan
npm run test:gen                                            # scaffold stubs
```

```js
import { describe, expect, it, vi, beforeEach, beforeAll } from "vitest";
```

**File naming:**

| Source | Test |
|--------|------|
| `users.schemas.js` | `users.schemas.test.js` |
| `users.controller.js` | `users.controller.test.js` |
| `test.routes.js` | `test.routes.integration.test.js` |

**Start with:** schema tests → pure service → controller (mock service) → Supertest for routes.

If you get stuck, open `src/modules/users/users.schemas.test.js`, copy a `describe` / `it` block, change the imports and assertions, and run `npm test`.
