import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { env } from "./env-config.js";
import { setupSwagger } from "./swagger-config.js";
import { apiRateLimiter } from "../shared/middlewares/rate-limiter.js";

/**
 * Register global middleware here in order (top runs first).
 * When you add a new middleware library, wire it here so `app.js` stays short.
 */
export function applyMiddlewares(app) {
  app.use(
    cors({
      origin: env.frontendOrigin,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());

  // Baseline rate limit for all `/api/v1` traffic (see `rate-limiter.js`). Modules may add stricter limits in `routes.register.js`.
  app.use("/api/v1", apiRateLimiter);

  setupSwagger(app);
}
