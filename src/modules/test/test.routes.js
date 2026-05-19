import { Router } from "express";

import { sendSuccess } from "../../shared/http/api-response.js";
import { authenticateJwt } from "../../shared/middlewares/auth-middleware.js";
import routesGuard from "../../shared/middlewares/routes-guard.js";

/**
 * Test / sample routes for this feature module.
 * These paths are relative to `/api/v1/test` (see this module’s `routes.register.js`).
 *
 * Mounted at `/api/v1/test` — e.g. `GET /api/v1/test/protected/me`.
 */
export const testRoutes = Router();

testRoutes.get("/", (_req, res) => {
  return sendSuccess(res, {
    message: "backend-javascript APIs",
    data: null,
  });
});

testRoutes.get("/health", (_req, res) => {
  return sendSuccess(res, {
    message: "API is running",
    data: { healthy: true },
  });
});

/** Valid Bearer access JWT only (`authenticateJwt`). */
testRoutes.get("/protected/me", authenticateJwt, (req, res) => {
  const user = req.authUser;
  return sendSuccess(res, {
    message: "Authenticated",
    data: {
      userId: user.id,
      email: user.email,
      rolesFromJwt: req.roles ?? [],
      permissionsFromJwt: req.permissions ?? [],
    },
  });
});

/** JWT + guard using role names embedded in the access token (`source: "token"`). */
testRoutes.get(
  "/protected/by-jwt-role",
  authenticateJwt,
  routesGuard({
    roles: ["admin"],
    source: "token",
  }),
  (_req, res) => {
    return sendSuccess(res, {
      message: "OK — JWT contained a matching role",
      data: null,
    });
  },
);

/** JWT + guard reloading roles/permissions from the DB (`source: "db"`). */
testRoutes.get(
  "/protected/by-db-permission",
  authenticateJwt,
  routesGuard({
    permissions: ["user:view"],
    source: "db",
  }),
  (_req, res) => {
    return sendSuccess(res, {
      message: "OK — current DB RBAC grants the required permission code",
      data: null,
    });
  },
);
