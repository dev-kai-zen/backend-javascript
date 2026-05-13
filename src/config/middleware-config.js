import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { env } from "./env-config.js";
import { setupSwagger } from "./swagger-config.js";
import { apiRateLimiter } from "../shared/middlewares/rate-limiter.js";

/**
 * Register global middleware here in order (top runs first).
 * When you add a new middleware library, wire it here so `app.ts` stays short.
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

  // Rate limits for `/api/v1` are applied in `shared/routes/index.js` (see `rate-limiter.js`).
  app.use("/api/v1", apiRateLimiter);

  setupSwagger(app);
}
