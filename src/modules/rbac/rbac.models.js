/**
 * RBAC Sequelize models — imported only from this module's `models.register.js`.
 * Order: category → role → permission → role_permission → user_role.
 */
import { RbacCategory } from "./categories/rbac-categories.model.js";
import { RbacRole } from "./roles/rbac-roles.model.js";
import { RbacPermission } from "./permissions/rbac-permissions.model.js";
import { RbacRolePermission } from "./role-permissions/rbac-role-permissions.model.js";
import { RbacUserRole } from "./user-roles/rbac-user-roles.model.js";

export const RbacModels = {
  RbacCategory,
  RbacRole,
  RbacPermission,
  RbacRolePermission,
  RbacUserRole,
};
