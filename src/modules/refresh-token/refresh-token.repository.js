import { RefreshToken } from "./refresh-token.model.js";

/**
 * @param {{ userId?: number }} filters
 * @returns {Promise<import("./refresh-token.model.js").RefreshToken[]>}
 */
export async function listRefreshTokens(filters) {
  /** @type {Record<string, unknown>} */
  const where = {};
  if (filters.userId !== undefined && Number.isFinite(filters.userId)) {
    where.user_id = filters.userId;
  }
  return RefreshToken.findAll({
    where,
    order: [["created_at", "DESC"]],
  });
}

/**
 * @param {{ userId: number; token: string; expiresAt: Date }} input
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<import("./refresh-token.model.js").RefreshToken>}
 */
export async function createRefreshToken(input, options = {}) {
  return RefreshToken.create(
    {
      user_id: input.userId,
      token: input.token,
      expires_at: input.expiresAt,
    },
    options,
  );
}

/**
 * @param {number} id
 * @returns {Promise<import("./refresh-token.model.js").RefreshToken | null>}
 */
export async function getRefreshToken(id) {
  return RefreshToken.findByPk(id);
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<boolean>}
 */
export async function deleteRefreshToken(id, options = {}) {
  const deleted = await RefreshToken.destroy({ where: { id }, ...options });
  return deleted > 0;
}

/**
 * @param {string} token
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<boolean>}
 */
export async function revokeRefreshToken(token, options = {}) {
  const deleted = await RefreshToken.destroy({ where: { token }, ...options });
  return deleted > 0;
}
