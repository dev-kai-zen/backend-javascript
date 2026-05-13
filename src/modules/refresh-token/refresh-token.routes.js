import { Router } from "express";

import {
  createRefreshToken,
  deleteRefreshToken,
  getRefreshToken,
  listRefreshTokens,
  revokeRefreshToken,
} from "./refresh-token.controller.js";

/**
 * Mounted at `/api/v1/refresh-tokens` (see `shared/routes/v1/modules-routes.js`).
 */
export const refreshTokenRoutes = Router();

refreshTokenRoutes.get("/", listRefreshTokens);
refreshTokenRoutes.post("/", createRefreshToken);
refreshTokenRoutes.post("/revoke", revokeRefreshToken);
refreshTokenRoutes.get("/:id", getRefreshToken);
refreshTokenRoutes.delete("/:id", deleteRefreshToken);
