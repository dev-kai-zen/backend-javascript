import { auditLogsRoutes } from "./audit-logs.routes.js";
import {authenticateJwt} from "../../shared/middlewares/auth-middleware.js";

export function registerV1Routes(v1Router) {
  v1Router.use("/audit-logs", authenticateJwt, auditLogsRoutes);
}
