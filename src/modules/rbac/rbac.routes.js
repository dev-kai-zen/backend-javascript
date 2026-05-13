import { Router } from "express";

import { rbacCategoriesRoutes } from "./categories/rbac-categories.routes.js";
import { rbacPermissionsRoutes } from "./permissions/rbac-permissions.routes.js";
import { rbacRolePermissionsRoutes } from "./role-permissions/rbac-role-permissions.routes.js";
import { rbacRolesRoutes } from "./roles/rbac-roles.routes.js";
import { rbacUserRolesRoutes } from "./user-roles/rbac-user-roles.routes.js";

export const rbacRoutes = Router();

rbacRoutes.use("/categories", rbacCategoriesRoutes);
rbacRoutes.use("/roles", rbacRolePermissionsRoutes);
rbacRoutes.use("/roles", rbacRolesRoutes);
rbacRoutes.use("/permissions", rbacPermissionsRoutes);
rbacRoutes.use("/", rbacUserRolesRoutes);
