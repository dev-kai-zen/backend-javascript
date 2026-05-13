import { Op } from "sequelize";

import { RbacPermission } from "./rbac-permissions.model.js";

/**
 * @param {string[]} permissionCodes
 */
export async function permissionDefinitionsEligibleForGuard(permissionCodes) {
  const unique = [...new Set(permissionCodes)];
  if (unique.length === 0) {
    return true;
  }
  const rows = await RbacPermission.findAll({
    where: { permission_code: { [Op.in]: unique } },
    attributes: ["permission_code", "is_active"],
  });
  const byCode = new Map(rows.map((r) => [r.permission_code, r]));
  return unique.every((c) => byCode.get(c)?.is_active === true);
}

/**
 * @param {{ categoryId?: number }} filters
 */
export async function listPermissions(filters) {
  /** @type {Record<string, unknown>} */
  const where = {};
  if (filters.categoryId !== undefined) {
    where.category_id = filters.categoryId;
  }
  return RbacPermission.findAll({ where, order: [["id", "ASC"]] });
}

/**
 * @param {{ permissionCode: string; permissionDescription: string | null; categoryId: number | null }} data
 */
export async function createPermission(data) {
  return RbacPermission.create({
    permission_code: data.permissionCode,
    permission_description: data.permissionDescription,
    category_id: data.categoryId,
  });
}

/**
 * @param {number} id
 */
export async function getPermission(id) {
  return RbacPermission.findByPk(id);
}

/**
 * @param {number} id
 * @param {{ permissionCode?: string; permissionDescription?: string | null; categoryId?: number | null; isActive?: boolean }} data
 */
export async function updatePermission(id, data) {
  const row = await RbacPermission.findByPk(id);
  if (!row) {
    return null;
  }
  /** @type {Record<string, unknown>} */
  const patch = {};
  if (data.permissionCode !== undefined) {
    patch.permission_code = data.permissionCode;
  }
  if (data.permissionDescription !== undefined) {
    patch.permission_description = data.permissionDescription;
  }
  if (data.categoryId !== undefined) {
    patch.category_id = data.categoryId;
  }
  if (data.isActive !== undefined) {
    patch.is_active = data.isActive;
  }
  await row.update(patch);
  return row;
}

/**
 * @param {number} id
 */
export async function deletePermission(id) {
  const deleted = await RbacPermission.destroy({ where: { id } });
  return deleted > 0;
}
