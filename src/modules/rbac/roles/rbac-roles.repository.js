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
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createRole(data, options = {}) {
  return RbacRole.create(
    {
      role_name: data.roleName,
      role_description: data.roleDescription,
    },
    options,
  );
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
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function updateRole(id, data, options = {}) {
  const role = await RbacRole.findByPk(id, options);
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
  await role.update(patch, options);
  return role;
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteRole(id, options = {}) {
  const deleted = await RbacRole.destroy({ where: { id }, ...options });
  return deleted > 0;
}
