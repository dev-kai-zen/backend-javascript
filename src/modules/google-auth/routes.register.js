import { googleAuthRoutes } from "./google-auth.routes.js";

export const routeRegistrationOrder = 20;

export function registerV1Routes(v1Router) {
  v1Router.use("/google-auth", googleAuthRoutes);
}
