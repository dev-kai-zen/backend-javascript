import { usersRoutes } from "./users.routes.js";

export function registerV1Routes(v1Router) {
  v1Router.use("/users", usersRoutes);
}
