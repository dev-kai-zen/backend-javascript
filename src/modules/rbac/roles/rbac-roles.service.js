import * as rbacRolesRepository from "./rbac-roles.repository.js";

export async function listRoles() {
  return rbacRolesRepository.listRoles();
}

/**
 * @param {{ roleName: string; roleDescription?: string | null }} data
 */
export async function createRole(data) {
  if (!data.roleName || data.roleName.trim() === "") {
    throw new Error("roleName is required");
  }
  return rbacRolesRepository.createRole({
    roleName: data.roleName.trim(),
    roleDescription: data.roleDescription ?? null,
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
 */
export async function updateRole(id, data) {
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
  return rbacRolesRepository.updateRole(id, patch);
}

/**
 * @param {number} id
 */
export async function deleteRole(id) {
  return rbacRolesRepository.deleteRole(id);
}

/**
 * @param {string[]} roleNames
 */
export async function roleDefinitionsEligibleForGuard(roleNames) {
  return rbacRolesRepository.roleDefinitionsEligibleForGuard(roleNames);
}
