import { Router } from "express";

import { authenticateJwt } from "../../shared/middlewares/auth-middleware.js";
import * as googleAuthController from "./google-auth.controller.js";

export const googleAuthRoutes = Router();

googleAuthRoutes.post("/login", googleAuthController.login);
googleAuthRoutes.post("/refresh", googleAuthController.refresh);
googleAuthRoutes.post("/logout", googleAuthController.logout);
googleAuthRoutes.get("/me", authenticateJwt, googleAuthController.me);
