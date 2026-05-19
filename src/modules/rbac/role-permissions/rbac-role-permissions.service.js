import { withTransaction } from "../../../shared/db/with-transaction.js";
import { parseInput } from "../../../shared/validation/parse-input.js";
import * as rbacRolesService from "../roles/rbac-roles.service.js";
import * as rbacRolePermissionsRepository from "./rbac-role-permissions.repository.js";
import {
  createRolePermissionBodySchema,
  setRolePermissionsBodySchema,
} from "./rbac-role-permissions.schemas.js";

/**
 * @param {number} roleId
 * @param {unknown} body
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function setRolePermissions(roleId, body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(setRolePermissionsBodySchema, body);
    const role = await rbacRolesService.getRole(roleId);
    if (!role) {
      return null;
    }
    const uniqueIds = [...new Set(parsed.permissionIds)];
    return rbacRolePermissionsRepository.setRolePermissionsForRole(
      roleId,
      uniqueIds,
      opts,
    );
  }, options);
}

/**
 * @param {number} roleId
 */
export async function listRolePermissions(roleId) {
  return rbacRolePermissionsRepository.listRolePermissions(roleId);
}

/**
 * @param {number} roleId
 * @param {unknown} body
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createRolePermission(roleId, body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createRolePermissionBodySchema, body);
    return rbacRolePermissionsRepository.createRolePermission(
      { roleId, permissionId: parsed.permissionId },
      opts,
    );
  }, options);
}

/**
 * @param {number} roleId
 * @param {number} permissionId
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function deleteRolePermission(roleId, permissionId, options = {}) {
  return withTransaction(
    (opts) =>
      rbacRolePermissionsRepository.deleteRolePermission(
        roleId,
        permissionId,
        opts,
      ),
    options,
  );
}

/**
 * @param {number[]} roleIds
 */
export async function getRolePermissionsByRoleIds(roleIds) {
  return rbacRolePermissionsRepository.getRolePermissionsByRoleIds(roleIds);
}
