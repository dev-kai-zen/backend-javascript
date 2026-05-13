import express from "express";

import { applyMiddlewares } from "./config/middleware-config.js";
import { registerRoutes } from "./shared/routes/index.js";

export function createApp() {
  const app = express();

  applyMiddlewares(app);
  registerRoutes(app);

  return app;
}
