import { v1ModulesRouter } from "./v1/modules-routes.js";

/**
 * Wire versioned API routes here. v1 lives under `/v1`.
 *
 * Example: test module is mounted at `/v1/test` (see `v1/modules-routes.ts`).
 */
export function registerRoutes(app) {
  app.use("/api/v1", v1ModulesRouter);
}
