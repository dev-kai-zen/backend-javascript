import { User } from "./users.model.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/**
 * @param {object} data
 * @returns {Promise<import("./users.model.js").User>}
 */
export async function createUser(data) {
  return User.create(data);
}

/**
 * @param {number} id
 * @returns {Promise<import("./users.model.js").User | null>}
 */
export async function getUserById(id) {
  return User.findByPk(id);
}

/**
 * @param {{ limit?: number; offset?: number }} query
 * @returns {Promise<import("./users.model.js").User[]>}
 */
export async function getUsers(query = {}) {
  const limitRaw = Number(query.limit);
  const offsetRaw = Number(query.offset);
  const limit = Math.min(
    Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : DEFAULT_LIMIT,
    MAX_LIMIT,
  );
  const offset =
    Number.isFinite(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0;
  return User.findAll({
    limit,
    offset,
    order: [["id", "ASC"]],
  });
}

/**
 * @param {number} id
 * @param {object} data
 * @returns {Promise<import("./users.model.js").User | null>}
 */
export async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.update(data);
  return user.reload();
}

/**
 * Soft-delete (paranoid).
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    return false;
  }
  await user.destroy();
  return true;
}
