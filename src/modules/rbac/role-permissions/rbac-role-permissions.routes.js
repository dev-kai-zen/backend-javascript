import { Router } from "express";

import * as rolePermissionsService from "./rbac-role-permissions.controller.js";
import { RBAC_ROLE_PERMISSIONS } from "../rbac.permissions.js";
import routesGuard from "../../../shared/middlewares/routes-guard.js";

/** Nested under `/rbac/roles` (mounted with prefix `/roles`). */
export const rbacRolePermissionsRoutes = Router();

rbacRolePermissionsRoutes.get(
  "/:id/permissions",
  routesGuard({ permissions: [RBAC_ROLE_PERMISSIONS.READ], source: "token" }),
  rolePermissionsService.listRolePermissions,
);
rbacRolePermissionsRoutes.put(
  "/:id/permissions",
  routesGuard({ permissions: [RBAC_ROLE_PERMISSIONS.WRITE], source: "token" }),
  rolePermissionsService.setRolePermissions,
);
rbacRolePermissionsRoutes.post(
  "/:id/permissions",
  routesGuard({ permissions: [RBAC_ROLE_PERMISSIONS.WRITE], source: "token" }),
  rolePermissionsService.createRolePermission,
);
rbacRolePermissionsRoutes.delete(
  "/:id/permissions/:permissionId",
  routesGuard({ permissions: [RBAC_ROLE_PERMISSIONS.DELETE], source: "db" }),
  rolePermissionsService.deleteRolePermission,
);
