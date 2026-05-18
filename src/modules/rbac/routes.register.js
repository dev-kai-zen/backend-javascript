import { rbacRoutes } from "./rbac.routes.js";

export const routeRegistrationOrder = 70;

export function registerV1Routes(v1Router) {
  v1Router.use("/rbac", rbacRoutes);
}
