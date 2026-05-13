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
 */
export async function setUserRoles(userId, roleIds, assignedBy) {
  return rbacUserRolesRepository.setUserRolesForUser(
    userId,
    roleIds,
    assignedBy,
  );
}

/**
 * @param {{ userId: number; roleId: number; assignedBy: number }} data
 */
export async function createUserRole(data) {
  return rbacUserRolesRepository.createUserRole({
    userId: data.userId,
    roleId: data.roleId,
    assignedBy: data.assignedBy,
  });
}

/**
 * @param {number} userId
 * @param {number} roleId
 */
export async function deleteUserRole(userId, roleId) {
  return rbacUserRolesRepository.deleteUserRole(userId, roleId);
}

/**
 * @param {number} userId
 */
export async function getUserRolesWithDescriptions(userId) {
  return rbacUserRolesRepository.getUserRolesWithDescriptions(userId);
}
