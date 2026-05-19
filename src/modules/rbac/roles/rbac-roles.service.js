import { withTransaction } from "../../../shared/db/with-transaction.js";
import { parseInput } from "../../../shared/validation/parse-input.js";
import * as rbacRolesRepository from "./rbac-roles.repository.js";
import {
  createRoleBodySchema,
  updateRoleBodySchema,
} from "./rbac-roles.schemas.js";

export async function listRoles() {
  return rbacRolesRepository.listRoles();
}

/**
 * @param {unknown} data
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createRole(data, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createRoleBodySchema, data);
    return rbacRolesRepository.createRole(parsed, opts);
  }, options);
}

/**
 * @param {number} id
 */
export async function getRole(id) {
  return rbacRolesRepository.getRole(id);
}

/**
 * @param {number} id
 * @param {unknown} data
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function updateRole(id, data, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(updateRoleBodySchema, data);
    return rbacRolesRepository.updateRole(id, parsed, opts);
  }, options);
}

/**
 * @param {number} id
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function deleteRole(id, options = {}) {
  return withTransaction(
    (opts) => rbacRolesRepository.deleteRole(id, opts),
    options,
  );
}

/**
 * @param {string[]} roleNames
 */
export async function roleDefinitionsEligibleForGuard(roleNames) {
  return rbacRolesRepository.roleDefinitionsEligibleForGuard(roleNames);
}
