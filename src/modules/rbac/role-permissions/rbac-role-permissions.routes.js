import { Router } from "express";

import {
  createRolePermission,
  deleteRolePermission,
  listRolePermissions,
  setRolePermissions,
} from "./rbac-role-permissions.controller.js";

/** Nested under `/rbac/roles` (mounted with prefix `/roles`). */
export const rbacRolePermissionsRoutes = Router();

rbacRolePermissionsRoutes.get("/:id/permissions", listRolePermissions);
rbacRolePermissionsRoutes.put("/:id/permissions", setRolePermissions);
rbacRolePermissionsRoutes.post("/:id/permissions", createRolePermission);
rbacRolePermissionsRoutes.delete(
  "/:id/permissions/:permissionId",
  deleteRolePermission,
);
