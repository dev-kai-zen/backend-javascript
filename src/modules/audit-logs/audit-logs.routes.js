import { Router } from "express";

import { listAuditLogs } from "./audit-logs.controller.js";

/**
 * Mounted at `/api/v1/audit-logs` (see `shared/routes/v1/modules-routes.js`).
 */
export const auditLogsRoutes = Router();

auditLogsRoutes.get("/", listAuditLogs);
