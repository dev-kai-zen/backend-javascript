import { Router } from "express";

import * as auditLogsController from "./audit-logs.controller.js";
import { AUDIT_LOGS_PERMISSIONS } from "./audit-logs.permissions.js";
import routesGuard from "../../shared/middlewares/routes-guard.js";

/**
 * Mounted at `/api/v1/audit-logs` (see this module’s `routes.register.js`).
 */
export const auditLogsRoutes = Router();

auditLogsRoutes.get(
  "/",
  routesGuard({ permissions: [AUDIT_LOGS_PERMISSIONS.READ], source: "token" }),
  auditLogsController.listAuditLogs,
);
auditLogsRoutes.post(
  "/",
  routesGuard({ permissions: [AUDIT_LOGS_PERMISSIONS.WRITE], source: "token" }),
  auditLogsController.createAuditLogs,
);
