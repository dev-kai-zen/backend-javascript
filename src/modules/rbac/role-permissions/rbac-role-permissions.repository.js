import { Op } from "sequelize";

import { sequelize } from "../../../config/sequelize-config.js";
import { RbacPermission } from "../permissions/rbac-permissions.model.js";
import { RbacRolePermission } from "./rbac-role-permissions.model.js";

/** Hard-deletes existing links for the role, then inserts the new set (see model unique + paranoid). */
export async function setRolePermissionsForRole(roleId, permissionIds) {
  return sequelize.transaction(async (transaction) => {
    const existing = await RbacRolePermission.findAll({
      where: { role_id: roleId },
      transaction,
    });
    if (existing.length > 0) {
      await RbacRolePermission.destroy({
        where: { role_id: roleId },
        force: true,
        transaction,
      });
    }
    if (permissionIds.length === 0) {
      return [];
    }
    return RbacRolePermission.bulkCreate(
      permissionIds.map((permission_id) => ({
        role_id: roleId,
        permission_id,
      })),
      { transaction, validate: true },
    );
  });
}

/**
 * @param {number} roleId
 */
export async function listRolePermissions(roleId) {
  return RbacRolePermission.findAll({
    where: { role_id: roleId },
    order: [["id", "ASC"]],
  });
}

/**
 * @param {{ roleId: number; permissionId: number }} data
 */
export async function createRolePermission(data) {
  return RbacRolePermission.create({
    role_id: data.roleId,
    permission_id: data.permissionId,
  });
}

/**
 * @param {number} roleId
 * @param {number} permissionId
 */
export async function deleteRolePermission(roleId, permissionId) {
  const deleted = await RbacRolePermission.destroy({
    where: { role_id: roleId, permission_id: permissionId },
  });
  return deleted > 0;
}

/**
 * @param {number[]} roleIds
 */
export async function getRolePermissionsByRoleIds(roleIds) {
  const rows = await RbacRolePermission.findAll({
    where: { role_id: { [Op.in]: roleIds } },
    include: [
      {
        model: RbacPermission,
        as: "permission",
        attributes: ["permission_code"],
        where: { is_active: true },
        required: true,
      },
    ],
  });

  return rows.map((row) => row.toJSON());
}
