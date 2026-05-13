import { Router } from "express";

import { auditLogsRoutes } from "../../../modules/audit-logs/audit-logs.routes.js";
import { googleAuthRoutes } from "../../../modules/google-auth/google-auth.routes.js";
import { rbacRoutes } from "../../../modules/rbac/rbac.routes.js";
import { refreshTokenRoutes } from "../../../modules/refresh-token/refresh-token.routes.js";
import { testRoutes } from "../../../modules/test/test.routes.js";
import { userLogsRoutes } from "../../../modules/user-logs/user-logs.routes.js";
import { usersRoutes } from "../../../modules/users/users.routes.js";

export const v1ModulesRouter = Router();

v1ModulesRouter.use("/test", testRoutes);
v1ModulesRouter.use("/google-auth", googleAuthRoutes);
v1ModulesRouter.use("/users", usersRoutes);
v1ModulesRouter.use("/user-logs", userLogsRoutes);
v1ModulesRouter.use("/audit-logs", auditLogsRoutes);
v1ModulesRouter.use("/refresh-tokens", refreshTokenRoutes);
v1ModulesRouter.use("/rbac", rbacRoutes);
