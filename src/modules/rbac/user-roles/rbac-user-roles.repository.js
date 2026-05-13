import { sequelize } from "../../../config/sequelize-config.js";
import { User } from "../../users/users.model.js";
import { RbacRole } from "../roles/rbac-roles.model.js";
import { RbacUserRole } from "./rbac-user-roles.model.js";

/** Hard-delete existing links for the user, then insert the new set (unique + paranoid; same idea as role-permissions). */
export async function setUserRolesForUser(userId, roleIds, assignedBy) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }
  const uniqueRoleIds = [...new Set(roleIds)];
  return sequelize.transaction(async (transaction) => {
    await RbacUserRole.destroy({
      where: { user_id: userId },
      force: true,
      transaction,
    });
    if (uniqueRoleIds.length === 0) {
      return [];
    }
    return RbacUserRole.bulkCreate(
      uniqueRoleIds.map((role_id) => ({
        user_id: userId,
        role_id,
        assigned_by: assignedBy,
      })),
      { transaction, validate: true },
    );
  });
}

/**
 * @param {number} userId
 */
export async function listUserRoles(userId) {
  return RbacUserRole.findAll({
    where: { user_id: userId },
    order: [["id", "ASC"]],
  });
}

/**
 * @param {{ userId: number; roleId: number; assignedBy: number }} data
 */
export async function createUserRole(data) {
  return RbacUserRole.create({
    user_id: data.userId,
    role_id: data.roleId,
    assigned_by: data.assignedBy,
  });
}

/**
 * @param {number} userId
 * @param {number} roleId
 */
export async function deleteUserRole(userId, roleId) {
  const deleted = await RbacUserRole.destroy({
    where: { user_id: userId, role_id: roleId },
  });
  return deleted > 0;
}

/**
 * @param {number} userId
 */
export async function getUserRolesWithDescriptions(userId) {
  const rows = await RbacUserRole.findAll({
    where: { user_id: userId },
    order: [["id", "ASC"]],
    include: [
      {
        model: RbacRole,
        as: "role",
        attributes: ["role_name", "role_description"],
        where: { is_active: true },
        required: true,
      },
    ],
  });

  return rows.map((row) => row.toJSON());
}
