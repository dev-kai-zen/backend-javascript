import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { env } from "./env-config.js";
import { setupSwagger } from "./swagger-config.js";

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

  setupSwagger(app);

  // Add more middlewares below this line, e.g.:
  // app.use(rateLimiter);
}
