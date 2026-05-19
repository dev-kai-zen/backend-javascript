import { User } from "./users.model.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/**
 * @param {object} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<import("./users.model.js").User>}
 */
export async function createUser(data, options = {}) {
  return User.create(data, options);
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
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<import("./users.model.js").User | null>}
 */
export async function updateUser(id, data, options = {}) {
  const user = await User.findByPk(id, options);
  if (!user) {
    return null;
  }
  await user.update(data, options);
  return user.reload(options);
}

/**
 * Soft-delete (paranoid).
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<boolean>}
 */
export async function deleteUser(id, options = {}) {
  const user = await User.findByPk(id, options);
  if (!user) {
    return false;
  }
  await user.destroy(options);
  return true;
}
