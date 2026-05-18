import { refreshTokenRoutes } from "./refresh-token.routes.js";

export function registerV1Routes(v1Router) {
  v1Router.use("/refresh-tokens", refreshTokenRoutes);
}
