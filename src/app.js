import express from "express";

import { applyMiddlewares } from "./config/middleware-config.js";

/**
 * @param {import("express").Router} v1ModulesRouter — built by `buildV1ModulesRouter()`
 */
export function createApp(v1ModulesRouter) {
  const app = express();

  applyMiddlewares(app);
  app.use("/api/v1", v1ModulesRouter);

  return app;
}
