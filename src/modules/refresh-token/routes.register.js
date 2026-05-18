import { refreshTokenRoutes } from "./refresh-token.routes.js";

export const routeRegistrationOrder = 60;

export function registerV1Routes(v1Router) {
  v1Router.use("/refresh-tokens", refreshTokenRoutes);
}
