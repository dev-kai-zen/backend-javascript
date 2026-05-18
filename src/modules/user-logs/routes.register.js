import { userLogsRoutes } from "./user-logs.routes.js";

export function registerV1Routes(v1Router) {
  v1Router.use("/user-logs", userLogsRoutes);
}
