import { Router } from "express";

import * as refreshTokenController from "./refresh-token.controller.js";

/**
 * Mounted at `/api/v1/refresh-tokens` (see this module’s `routes.register.js`).
 */
export const refreshTokenRoutes = Router();

refreshTokenRoutes.get("/", refreshTokenController.listRefreshTokens);
refreshTokenRoutes.post("/", refreshTokenController.createRefreshToken);
refreshTokenRoutes.post("/revoke", refreshTokenController.revokeRefreshToken);
refreshTokenRoutes.get("/:id", refreshTokenController.getRefreshToken);
refreshTokenRoutes.delete("/:id", refreshTokenController.deleteRefreshToken);
