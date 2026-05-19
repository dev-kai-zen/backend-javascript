import { sequelize } from "../../../config/sequelize-config.js";
import * as rbacPermissionsRepository from "./rbac-permissions.repository.js";

/**
 * @param {{ categoryId?: number }} filters
 */
export async function listPermissions(filters) {
  return rbacPermissionsRepository.listPermissions(filters);
}

/**
 * @param {{ permissionCode: string; permissionDescription: string | null; categoryId: number | null }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _createPermission(data, options = {}) {
  if (!data.permissionCode || data.permissionCode.trim() === "") {
    throw new Error("permissionCode is required");
  }

  const payload = {
    permissionCode: data.permissionCode.trim(),
    permissionDescription: data.permissionDescription ?? null,
    categoryId: data.categoryId ?? null,
  };

  return rbacPermissionsRepository.createPermission(payload, options);
}

/**
 * @param {{ permissionCode: string; permissionDescription?: string | null; categoryId?: number | null }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createPermission(data, options = {}) {

  if (options.transaction) {
    return _createPermission(data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _createPermission(data, { ...options, transaction });
  });
}

/**
 * @param {number} id
 */
export async function getPermission(id) {
  return rbacPermissionsRepository.getPermission(id);
}

/**
 * @param {number} id
 * @param {{ permissionCode?: string; permissionDescription?: string | null; categoryId?: number | null; isActive?: boolean }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _updatePermission(id, data, options = {}) {
  if (
    data.permissionCode !== undefined &&
    (typeof data.permissionCode !== "string" ||
      data.permissionCode.trim() === "")
  ) {
    throw new Error("permissionCode cannot be empty");
  }
  /** @type {{ permissionCode?: string; permissionDescription?: string | null; categoryId?: number | null; isActive?: boolean }} */
  const patch = {};
  if (data.permissionCode !== undefined) {
    patch.permissionCode = data.permissionCode.trim();
  }
  if (data.permissionDescription !== undefined) {
    patch.permissionDescription = data.permissionDescription;
  }
  if (data.categoryId !== undefined) {
    patch.categoryId = data.categoryId;
  }
  if (data.isActive !== undefined) {
    patch.isActive = data.isActive;
  }
  if (Object.keys(patch).length === 0) {
    throw new Error("No fields to update");
  }

  return rbacPermissionsRepository.updatePermission(id, patch, options);
}

/**
 * @param {number} id
 * @param {{ permissionCode?: string; permissionDescription?: string | null; categoryId?: number | null; isActive?: boolean }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function updatePermission(id, data, options = {}) {
  if (options.transaction) {
    return _updatePermission(id, data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _updatePermission(id, data, { ...options, transaction });
  });
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _deletePermission(id, options = {}) {
  return rbacPermissionsRepository.deletePermission(id, options);
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deletePermission(id, options = {}) {
  if (options.transaction) {
    return _deletePermission(id, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _deletePermission(id, { ...options, transaction });
  });
}

/**
 * @param {string[]} permissionCodes
 */
export async function permissionDefinitionsEligibleForGuard(permissionCodes) {
  return rbacPermissionsRepository.permissionDefinitionsEligibleForGuard(
    permissionCodes,
  );
}
