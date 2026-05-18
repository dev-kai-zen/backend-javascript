import { Router } from "express";

import * as rolePermissionsService from "./rbac-role-permissions.controller.js";

/** Nested under `/rbac/roles` (mounted with prefix `/roles`). */
export const rbacRolePermissionsRoutes = Router();

rbacRolePermissionsRoutes.get("/:id/permissions", rolePermissionsService.listRolePermissions);
rbacRolePermissionsRoutes.put("/:id/permissions", rolePermissionsService.setRolePermissions);
rbacRolePermissionsRoutes.post("/:id/permissions", rolePermissionsService.createRolePermission);
rbacRolePermissionsRoutes.delete(
  "/:id/permissions/:permissionId",
  rolePermissionsService.deleteRolePermission,
);
