/**
 * Central Sequelize model registry (same idea as wellness-and-safety-be `shared/models/index.js`).
 * Import once at process startup — before `sequelize.authenticate()` — so every `Model.init`
 * and association runs in a stable order without scattering side-effect imports in `index.ts`.
 */
import { sequelize } from "../../config/sequelize-config.js";
import { User } from "../../modules/users/users.model.js";
import { RbacCategory } from "../../modules/rbac/categories/rbac-categories.model.js";
import { RbacPermission } from "../../modules/rbac/permissions/rbac-permissions.model.js";
import { RbacRolePermission } from "../../modules/rbac/role-permissions/rbac-role-permissions.model.js";
import { RbacRole } from "../../modules/rbac/roles/rbac-roles.model.js";
import { RbacUserRole } from "../../modules/rbac/user-roles/rbac-user-roles.model.js";
import { UserLog } from "../../modules/user-logs/user-logs.model.js";
import { AuditLog } from "../../modules/audit-logs/audit-logs.model.js";
import { RefreshToken } from "../../modules/refresh-token/refresh-token.model.js";

export const models = {
  User,
  RbacCategory,
  RbacRole,
  RbacPermission,
  RbacRolePermission,
  RbacUserRole,
  UserLog,
  AuditLog,
  RefreshToken,
};

export { sequelize };
