import { sequelize } from "../../../config/sequelize-config.js";
import * as rbacRolesRepository from "./rbac-roles.repository.js";

export async function listRoles() {
  return rbacRolesRepository.listRoles();
}

/**
 * @param {{ roleName: string; roleDescription: string | null }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _createRole(data, options = {}) {
  if (!data.roleName || data.roleName.trim() === "") {
    throw new Error("roleName is required");
  }

  const payload = {
    roleName: data.roleName.trim(),
    roleDescription: data.roleDescription ?? null,
  };

  return rbacRolesRepository.createRole(payload, options);
}

/**
 * @param {{ roleName: string; roleDescription?: string | null }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createRole(data, options = {}) {


  if (options.transaction) {
    return _createRole(data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _createRole(data, { ...options, transaction });
  });
}

/**
 * @param {number} id
 */
export async function getRole(id) {
  return rbacRolesRepository.getRole(id);
}

/**
 * @param {number} id
 * @param {{ roleName?: string; roleDescription?: string | null; isActive?: boolean }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _updateRole(id, data, options = {}) {
  if (
    data.roleName !== undefined &&
    (typeof data.roleName !== "string" || data.roleName.trim() === "")
  ) {
    throw new Error("roleName cannot be empty");
  }
  /** @type {{ roleName?: string; roleDescription?: string | null; isActive?: boolean }} */
  const patch = {};
  if (data.roleName !== undefined) {
    patch.roleName = data.roleName.trim();
  }
  if (data.roleDescription !== undefined) {
    patch.roleDescription = data.roleDescription;
  }
  if (data.isActive !== undefined) {
    patch.isActive = data.isActive;
  }
  if (Object.keys(patch).length === 0) {
    throw new Error("No fields to update");
  }

  return rbacRolesRepository.updateRole(id, patch, options);
}

/**
 * @param {number} id
 * @param {{ roleName?: string; roleDescription?: string | null; isActive?: boolean }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function updateRole(id, data, options = {}) {
  if (options.transaction) {
    return _updateRole(id, data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _updateRole(id, data, { ...options, transaction });
  });
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _deleteRole(id, options = {}) {
  return rbacRolesRepository.deleteRole(id, options);
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteRole(id, options = {}) {
  if (options.transaction) {
    return _deleteRole(id, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _deleteRole(id, { ...options, transaction });
  });
}

/**
 * @param {string[]} roleNames
 */
export async function roleDefinitionsEligibleForGuard(roleNames) {
  return rbacRolesRepository.roleDefinitionsEligibleForGuard(roleNames);
}
