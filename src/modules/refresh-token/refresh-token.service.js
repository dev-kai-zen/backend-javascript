import {
  createRefreshToken as createRefreshTokenRepo,
  deleteRefreshToken as deleteRefreshTokenRepo,
  getRefreshToken as getRefreshTokenRepo,
  listRefreshTokens as listRefreshTokensRepo,
  revokeRefreshToken as revokeRefreshTokenRepo,
} from "./refresh-token.repository.js";

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
  return listRefreshTokensRepo(filters);
}

/**
 * @param {unknown} body
 */
export async function createRefreshToken(body) {
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

  return createRefreshTokenRepo({
    userId,
    token,
    expiresAt,
  });
}

/**
 * @param {number} id
 */
export async function getRefreshToken(id) {
  return getRefreshTokenRepo(id);
}

/**
 * @param {number} id
 */
export async function deleteRefreshToken(id) {
  return deleteRefreshTokenRepo(id);
}

/**
 * @param {unknown} body
 */
export async function revokeRefreshToken(body) {
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
  return revokeRefreshTokenRepo(token);
}
