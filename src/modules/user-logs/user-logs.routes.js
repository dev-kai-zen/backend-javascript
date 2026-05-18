import { Router } from "express";

import { createUserLog, listUserLogs } from "./user-logs.controller.js";

/**
 * Mounted at `/api/v1/user-logs` (see this module’s `routes.register.js`).
 */
export const userLogsRoutes = Router();

userLogsRoutes.get("/", listUserLogs);
userLogsRoutes.post("/", createUserLog);
