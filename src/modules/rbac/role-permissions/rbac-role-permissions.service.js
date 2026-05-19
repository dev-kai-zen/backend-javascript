import { sequelize } from "../../../config/sequelize-config.js";
import * as rbacRolesService from "../roles/rbac-roles.service.js";
import * as rbacRolePermissionsRepository from "./rbac-role-permissions.repository.js";

/**
 * @param {number} roleId
 * @param {number[]} permissionIds
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _setRolePermissions(roleId, permissionIds, options = {}) {
  const role = await rbacRolesService.getRole(roleId);
  if (!role) {
    return null;
  }
  const uniqueIds = [...new Set(permissionIds)];

  return rbacRolePermissionsRepository.setRolePermissionsForRole(
    roleId,
    uniqueIds,
    options,
  );
}

/**
 * @param {number} roleId
 * @param {number[]} permissionIds
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function setRolePermissions(roleId, permissionIds, options = {}) {

  if (options.transaction) {
    return _setRolePermissions(roleId, permissionIds, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _setRolePermissions(roleId, permissionIds, { ...options, transaction });
  });
}

/**
 * @param {number} roleId
 */
export async function listRolePermissions(roleId) {
  return rbacRolePermissionsRepository.listRolePermissions(roleId);
}

/**
 * @param {{ roleId: number; permissionId: number }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _createRolePermission(data, options = {}) {
  return rbacRolePermissionsRepository.createRolePermission(data, options);
}

/**
 * @param {{ roleId: number; permissionId: number }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createRolePermission(data, options = {}) {
  if (options.transaction) {
    return _createRolePermission(data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _createRolePermission(data, { ...options, transaction });
  });
}

/**
 * @param {number} roleId
 * @param {number} permissionId
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _deleteRolePermission(roleId, permissionId, options = {}) {
  return rbacRolePermissionsRepository.deleteRolePermission(
    roleId,
    permissionId,
    options,
  );
}

/**
 * @param {number} roleId
 * @param {number} permissionId
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteRolePermission(roleId, permissionId, options = {}) {
  if (options.transaction) {
    return _deleteRolePermission(roleId, permissionId, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _deleteRolePermission(roleId, permissionId, {
      ...options,
      transaction,
    });
  });
}

/**
 * @param {number[]} roleIds
 */
export async function getRolePermissionsByRoleIds(roleIds) {
  return rbacRolePermissionsRepository.getRolePermissionsByRoleIds(roleIds);
}
