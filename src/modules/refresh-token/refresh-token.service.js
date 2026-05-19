import { sequelize } from "../../config/sequelize-config.js";
import * as refreshTokenRepository from "./refresh-token.repository.js";

/**
 * @param {string | undefined} userIdRaw
 * @returns {{ userId?: number }}
 */
export function parseListFilters(userIdRaw) {
  /** @type {{ userId?: number }} */
  const filters = {};
  if (userIdRaw === undefined) {
    return filters;
  }
  const raw = String(userIdRaw).trim();
  if (raw === "") {
    return filters;
  }
  const n = Number.parseInt(raw, 10);
  if (Number.isFinite(n)) {
    filters.userId = n;
  }
  return filters;
}

/**
 * @param {{ userId?: number }} filters
 */
export async function listRefreshTokens(filters) {
  return refreshTokenRepository.listRefreshTokens(filters);
}

/**
 * @param {unknown} body
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _createRefreshToken(body, options = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body is required");
  }

  const userId = Number(body.userId);
  if (!Number.isInteger(userId) || userId < 1) {
    throw new Error("userId must be a positive integer");
  }

  if (typeof body.token !== "string" || !body.token.trim()) {
    throw new Error("token is required");
  }
  const token = body.token.trim();
  if (token.length > 512) {
    throw new Error("token must be at most 512 characters");
  }

  if (typeof body.expiresAt !== "string" || !body.expiresAt.trim()) {
    throw new Error("expiresAt must be a valid ISO date string");
  }
  const expiresAt = new Date(body.expiresAt.trim());
  if (Number.isNaN(expiresAt.getTime())) {
    throw new Error("expiresAt must be a valid ISO date string");
  }

  const payload = { userId, token, expiresAt };

  return refreshTokenRepository.createRefreshToken(payload, options);
}

/**
 * @param {unknown} body
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createRefreshToken(body, options = {}) {
  if (options.transaction) {
    return _createRefreshToken(body, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _createRefreshToken(body, { ...options, transaction });
  });
}

/**
 * @param {number} id
 */
export async function getRefreshToken(id) {
  return refreshTokenRepository.getRefreshToken(id);
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _deleteRefreshToken(id, options = {}) {
  return refreshTokenRepository.deleteRefreshToken(id, options);
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteRefreshToken(id, options = {}) {
  if (options.transaction) {
    return _deleteRefreshToken(id, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _deleteRefreshToken(id, { ...options, transaction });
  });
}

/**
 * @param {string} token
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _revokeRefreshToken(body, options = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body is required");
  }
  if (typeof body.token !== "string" || !body.token.trim()) {
    throw new Error("token is required");
  }
  const token = body.token.trim();
  if (token.length > 512) {
    throw new Error("token must be at most 512 characters");
  }

  return refreshTokenRepository.revokeRefreshToken(token, options);
}

/**
 * @param {unknown} body
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function revokeRefreshToken(body, options = {}) {
  

  if (options.transaction) {
    return _revokeRefreshToken(body, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _revokeRefreshToken(body, { ...options, transaction });
  });
}
