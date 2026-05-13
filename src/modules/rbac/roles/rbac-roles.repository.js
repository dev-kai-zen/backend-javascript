import { Op } from "sequelize";

import { RbacRole } from "./rbac-roles.model.js";

/**
 * @param {string[]} roleNames
 */
export async function roleDefinitionsEligibleForGuard(roleNames) {
  const unique = [...new Set(roleNames)];
  if (unique.length === 0) {
    return true;
  }
  const rows = await RbacRole.findAll({
    where: { role_name: { [Op.in]: unique } },
    attributes: ["role_name", "is_active"],
  });
  const byName = new Map(rows.map((r) => [r.role_name, r]));
  return unique.every((n) => byName.get(n)?.is_active === true);
}

export async function listRoles() {
  return RbacRole.findAll({ order: [["id", "ASC"]] });
}

/**
 * @param {{ roleName: string; roleDescription: string | null }} data
 */
export async function createRole(data) {
  return RbacRole.create({
    role_name: data.roleName,
    role_description: data.roleDescription,
  });
}

/**
 * @param {number} id
 */
export async function getRole(id) {
  return RbacRole.findByPk(id);
}

/**
 * @param {number} id
 * @param {{ roleName?: string; roleDescription?: string | null; isActive?: boolean }} data
 */
export async function updateRole(id, data) {
  const role = await RbacRole.findByPk(id);
  if (!role) {
    return null;
  }
  /** @type {Record<string, unknown>} */
  const patch = {};
  if (data.roleName !== undefined) {
    patch.role_name = data.roleName;
  }
  if (data.roleDescription !== undefined) {
    patch.role_description = data.roleDescription;
  }
  if (data.isActive !== undefined) {
    patch.is_active = data.isActive;
  }
  await role.update(patch);
  return role;
}

/**
 * @param {number} id
 */
export async function deleteRole(id) {
  const deleted = await RbacRole.destroy({ where: { id } });
  return deleted > 0;
}
