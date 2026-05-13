import { Router } from "express";

/**
 * Test / sample routes for this feature module.
 * These paths are relative to where this router is mounted (see `modules-routes.ts`).
 *
 * Mounted at `/api/v1/test` — e.g. `GET /api/v1/test/protected/me`.
 */
export const testRoutes = Router();

testRoutes.get("/", (_req, res) => {
  res.json({ message: "backend-javascript APIs" });
});

testRoutes.get("/health", (_req, res) => {
  res.json({ status: "API is running" });
});
