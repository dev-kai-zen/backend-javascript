import { Router } from "express";

import { createUserLog, listUserLogs } from "./user-logs.controller.js";

/**
 * Mounted at `/api/v1/user-logs` (see `shared/routes/v1/modules-routes.js`).
 */
export const userLogsRoutes = Router();

userLogsRoutes.get("/", listUserLogs);
userLogsRoutes.post("/", createUserLog);
