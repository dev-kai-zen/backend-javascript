import { withTransaction } from "../../../shared/db/with-transaction.js";
import { parseInput } from "../../../shared/validation/parse-input.js";
import * as rbacPermissionsRepository from "./rbac-permissions.repository.js";
import {
  createPermissionBodySchema,
  updatePermissionBodySchema,
} from "./rbac-permissions.schemas.js";

/**
 * @param {{ categoryId?: number }} filters
 */
export async function listPermissions(filters) {
  return rbacPermissionsRepository.listPermissions(filters);
}

/**
 * @param {unknown} data
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createPermission(data, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createPermissionBodySchema, data);
    return rbacPermissionsRepository.createPermission(parsed, opts);
  }, options);
}

/**
 * @param {number} id
 */
export async function getPermission(id) {
  return rbacPermissionsRepository.getPermission(id);
}

/**
 * @param {number} id
 * @param {unknown} data
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function updatePermission(id, data, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(updatePermissionBodySchema, data);
    return rbacPermissionsRepository.updatePermission(id, parsed, opts);
  }, options);
}

/**
 * @param {number} id
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function deletePermission(id, options = {}) {
  return withTransaction(
    (opts) => rbacPermissionsRepository.deletePermission(id, opts),
    options,
  );
}

/**
 * @param {string[]} permissionCodes
 */
export async function permissionDefinitionsEligibleForGuard(permissionCodes) {
  return rbacPermissionsRepository.permissionDefinitionsEligibleForGuard(
    permissionCodes,
  );
}
