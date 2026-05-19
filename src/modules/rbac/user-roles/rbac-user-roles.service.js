import { withTransaction } from "../../../shared/db/with-transaction.js";
import { parseInput } from "../../../shared/validation/parse-input.js";
import * as usersService from "../../users/users.service.js";
import * as rbacUserRolesRepository from "./rbac-user-roles.repository.js";
import {
  createUserRoleBodySchema,
  setUserRolesBodySchema,
} from "./rbac-user-roles.schemas.js";

/**
 * @param {number} userId
 */
export async function listUserRoles(userId) {
  return rbacUserRolesRepository.listUserRoles(userId);
}

/**
 * @param {number} userId
 * @param {unknown} body
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function setUserRoles(userId, body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(setUserRolesBodySchema, body);
    const user = await usersService.getUserById(userId);
    if (!user) {
      return null;
    }
    const uniqueRoleIds = [...new Set(parsed.roleIds)];
    return rbacUserRolesRepository.setUserRolesForUser(
      userId,
      uniqueRoleIds,
      parsed.assignedBy,
      opts,
    );
  }, options);
}

/**
 * @param {number} userId
 * @param {unknown} body
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createUserRole(userId, body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createUserRoleBodySchema, body);
    return rbacUserRolesRepository.createUserRole(
      {
        userId,
        roleId: parsed.roleId,
        assignedBy: parsed.assignedBy,
      },
      opts,
    );
  }, options);
}

/**
 * @param {number} userId
 * @param {number} roleId
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function deleteUserRole(userId, roleId, options = {}) {
  return withTransaction(
    (opts) => rbacUserRolesRepository.deleteUserRole(userId, roleId, opts),
    options,
  );
}

/**
 * @param {number} userId
 */
export async function getUserRolesWithDescriptions(userId) {
  return rbacUserRolesRepository.getUserRolesWithDescriptions(userId);
}
