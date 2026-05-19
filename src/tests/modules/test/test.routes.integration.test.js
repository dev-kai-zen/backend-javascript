import request from "supertest";

import { createTestApp } from "../../helpers/create-test-app.js";

describe("test.routes integration", () => {
  let app;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it("GET /api/v1/test returns success envelope", async () => {
    const response = await request(app).get("/api/v1/test/");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: true,
      message: "backend-javascript APIs",
    });
  });

  it("GET /api/v1/test/health returns healthy payload", async () => {
    const response = await request(app).get("/api/v1/test/health");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ healthy: true });
  });

  it("GET /api/v1/test/protected/me returns 401 without token", async () => {
    const response = await request(app).get("/api/v1/test/protected/me");

    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
  });
});
