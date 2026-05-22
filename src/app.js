import express from "express";

import { applyMiddlewares } from "./config/middleware-config.js";
import { authenticateJwt } from "./shared/middlewares/auth-middleware.js";
import { apiRateLimiter } from "./shared/middlewares/rate-limiter.js";
import { googleAuthRoutes } from "./modules/google-auth/google-auth.routes.js";

/**
 * @param {import("express").Router} v1ModulesRouter — built by `buildV1ModulesRouter()`
 */
export function createApp(v1ModulesRouter) {
  const app = express();

  applyMiddlewares(app);

  app.use("/google-auth", googleAuthRoutes);
  app.use("/api/v1", authenticateJwt, apiRateLimiter, v1ModulesRouter);

  return app;
}
