import { userLogsRoutes } from "./user-logs.routes.js";

export const routeRegistrationOrder = 40;

export function registerV1Routes(v1Router) {
  v1Router.use("/user-logs", userLogsRoutes);
}
