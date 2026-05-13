import * as rbacPermissionsRepository from "./rbac-permissions.repository.js";

/**
 * @param {{ categoryId?: number }} filters
 */
export async function listPermissions(filters) {
  return rbacPermissionsRepository.listPermissions(filters);
}

/**
 * @param {{ permissionCode: string; permissionDescription?: string | null; categoryId?: number | null }} data
 */
export async function createPermission(data) {
  if (!data.permissionCode || data.permissionCode.trim() === "") {
    throw new Error("permissionCode is required");
  }
  return rbacPermissionsRepository.createPermission({
    permissionCode: data.permissionCode.trim(),
    permissionDescription: data.permissionDescription ?? null,
    categoryId: data.categoryId ?? null,
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
 */
export async function updatePermission(id, data) {
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
  return rbacPermissionsRepository.updatePermission(id, patch);
}

/**
 * @param {number} id
 */
export async function deletePermission(id) {
  return rbacPermissionsRepository.deletePermission(id);
}

/**
 * @param {string[]} permissionCodes
 */
export async function permissionDefinitionsEligibleForGuard(permissionCodes) {
  return rbacPermissionsRepository.permissionDefinitionsEligibleForGuard(
    permissionCodes,
  );
}
