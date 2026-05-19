import { sequelize } from "../../../config/sequelize-config.js";
import * as usersService from "../../users/users.service.js";
import * as rbacUserRolesRepository from "./rbac-user-roles.repository.js";

/**
 * @param {number} userId
 */
export async function listUserRoles(userId) {
  return rbacUserRolesRepository.listUserRoles(userId);
}

/**
 * @param {number} userId
 * @param {number[]} roleIds
 * @param {number} assignedBy
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _setUserRoles(userId, roleIds, assignedBy, options = {}) {
  const user = await usersService.getUserById(userId);
  if (!user) {
    return null;
  }
  const uniqueRoleIds = [...new Set(roleIds)];

  return rbacUserRolesRepository.setUserRolesForUser(
    userId,
    uniqueRoleIds,
    assignedBy,
    options,
  );
}

/**
 * @param {number} userId
 * @param {number[]} roleIds
 * @param {number} assignedBy
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function setUserRoles(userId, roleIds, assignedBy, options = {}) {


  if (options.transaction) {
    return _setUserRoles(userId, roleIds, assignedBy, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _setUserRoles(userId, roleIds, assignedBy, {
      ...options,
      transaction,
    });
  });
}

/**
 * @param {{ userId: number; roleId: number; assignedBy: number }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _createUserRole(data, options = {}) {
  return rbacUserRolesRepository.createUserRole(data, options);
}

/**
 * @param {{ userId: number; roleId: number; assignedBy: number }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createUserRole(data, options = {}) {
  if (options.transaction) {
    return _createUserRole(data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _createUserRole(data, { ...options, transaction });
  });
}

/**
 * @param {number} userId
 * @param {number} roleId
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _deleteUserRole(userId, roleId, options = {}) {
  return rbacUserRolesRepository.deleteUserRole(userId, roleId, options);
}

/**
 * @param {number} userId
 * @param {number} roleId
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteUserRole(userId, roleId, options = {}) {
  if (options.transaction) {
    return _deleteUserRole(userId, roleId, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _deleteUserRole(userId, roleId, { ...options, transaction });
  });
}

/**
 * @param {number} userId
 */
export async function getUserRolesWithDescriptions(userId) {
  return rbacUserRolesRepository.getUserRolesWithDescriptions(userId);
}
