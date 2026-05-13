import * as rolesRepository from "../roles/rbac-roles.repository.js";
import * as rbacRolePermissionsRepository from "./rbac-role-permissions.repository.js";

/**
 * @param {number} roleId
 * @param {number[]} permissionIds
 */
export async function setRolePermissions(roleId, permissionIds) {
  const role = await rolesRepository.getRole(roleId);
  if (!role) {
    return null;
  }
  const uniqueIds = [...new Set(permissionIds)];
  return rbacRolePermissionsRepository.setRolePermissionsForRole(
    roleId,
    uniqueIds,
  );
}

/**
 * @param {number} roleId
 */
export async function listRolePermissions(roleId) {
  return rbacRolePermissionsRepository.listRolePermissions(roleId);
}

/**
 * @param {{ roleId: number; permissionId: number }} data
 */
export async function createRolePermission(data) {
  return rbacRolePermissionsRepository.createRolePermission({
    roleId: data.roleId,
    permissionId: data.permissionId,
  });
}

/**
 * @param {number} roleId
 * @param {number} permissionId
 */
export async function deleteRolePermission(roleId, permissionId) {
  return rbacRolePermissionsRepository.deleteRolePermission(
    roleId,
    permissionId,
  );
}

/**
 * @param {number[]} roleIds
 */
export async function getRolePermissionsByRoleIds(roleIds) {
  return rbacRolePermissionsRepository.getRolePermissionsByRoleIds(roleIds);
}
