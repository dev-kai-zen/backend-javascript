import { googleAuthRoutes } from "./google-auth.routes.js";

export function registerV1Routes(v1Router) {
  v1Router.use("/google-auth", googleAuthRoutes);
}
