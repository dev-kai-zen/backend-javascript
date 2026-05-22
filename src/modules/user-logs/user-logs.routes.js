import { Router } from "express";

import * as userLogsController from "./user-logs.controller.js";
import { USER_LOGS_PERMISSIONS } from "./user-logs.permissions.js";
import routesGuard from "../../shared/middlewares/routes-guard.js";

/**
 * Mounted at `/api/v1/user-logs` (see this module’s `routes.register.js`).
 */
export const userLogsRoutes = Router();

userLogsRoutes.get(
  "/",
  routesGuard({ permissions: [USER_LOGS_PERMISSIONS.READ], source: "token" }),
  userLogsController.listUserLogs,
);
userLogsRoutes.post(
  "/",
  routesGuard({ permissions: [USER_LOGS_PERMISSIONS.WRITE], source: "token" }),
  userLogsController.createUserLog,
);
