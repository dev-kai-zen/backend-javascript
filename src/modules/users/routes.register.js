import { usersRoutes } from "./users.routes.js";

export const routeRegistrationOrder = 30;

export function registerV1Routes(v1Router) {
  v1Router.use("/users", usersRoutes);
}
