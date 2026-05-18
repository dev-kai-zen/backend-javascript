import { Router } from "express";

import { listAuditLogs } from "./audit-logs.controller.js";

/**
 * Mounted at `/api/v1/audit-logs` (see this module’s `routes.register.js`).
 */
export const auditLogsRoutes = Router();

auditLogsRoutes.get("/", listAuditLogs);
