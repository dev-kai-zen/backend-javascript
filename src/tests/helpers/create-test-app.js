import { createApp } from "../../app.js";
import { buildV1ModulesRouter } from "../../bootstrap/register-module-routes.js";

/**
 * Express app for integration tests (all discovered `/api/v1` routes, no listen).
 * @returns {Promise<import("express").Express>}
 */
export async function createTestApp() {
  const v1ModulesRouter = await buildV1ModulesRouter();
  return createApp(v1ModulesRouter);
}
