import { auditLogsRoutes } from "./audit-logs.routes.js";

export function registerV1Routes(v1Router) {
  v1Router.use("/audit-logs", auditLogsRoutes);
}
