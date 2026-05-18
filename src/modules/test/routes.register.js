import { apiRateLimiter } from "../../shared/middlewares/rate-limiter.js";
import { testRoutes } from "./test.routes.js";

export const routeRegistrationOrder = 10;

export function registerV1Routes(v1Router) {
  v1Router.use("/test", apiRateLimiter, testRoutes);
}
