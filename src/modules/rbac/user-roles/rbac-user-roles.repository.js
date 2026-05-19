import { RbacRole } from "../roles/rbac-roles.model.js";
import { RbacUserRole } from "./rbac-user-roles.model.js";

/**
 * Hard-delete existing links for the user, then insert the new set (unique + paranoid; same idea as role-permissions).
 * @param {number} userId
 * @param {number[]} roleIds
 * @param {number} assignedBy
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function setUserRolesForUser(userId, roleIds, assignedBy, options = {}) {
  await RbacUserRole.destroy({
    where: { user_id: userId },
    force: true,
    ...options,
  });
  if (roleIds.length === 0) {
    return [];
  }
  return RbacUserRole.bulkCreate(
    roleIds.map((role_id) => ({
      user_id: userId,
      role_id,
      assigned_by: assignedBy,
    })),
    { ...options, validate: true },
  );
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
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createUserRole(data, options = {}) {
  return RbacUserRole.create(
    {
      user_id: data.userId,
      role_id: data.roleId,
      assigned_by: data.assignedBy,
    },
    options,
  );
}

/**
 * @param {number} userId
 * @param {number} roleId
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteUserRole(userId, roleId, options = {}) {
  const deleted = await RbacUserRole.destroy({
    where: { user_id: userId, role_id: roleId },
    ...options,
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
