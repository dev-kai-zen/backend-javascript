import { Router } from "express";

import { authenticateJwt } from "../../shared/middlewares/auth-middleware.js";
import { authRateLimiter } from "../../shared/middlewares/rate-limiter.js";
import * as googleAuthController from "./google-auth.controller.js";

export const googleAuthRoutes = Router();

googleAuthRoutes.post("/login", authRateLimiter, googleAuthController.login);
googleAuthRoutes.post("/refresh", googleAuthController.refresh);
googleAuthRoutes.post("/logout",authRateLimiter, googleAuthController.logout);
googleAuthRoutes.get("/me", authenticateJwt, googleAuthController.me);
