import { withTransaction } from "../../shared/db/with-transaction.js";
import { parseInput } from "../../shared/validation/parse-input.js";
import * as refreshTokenRepository from "./refresh-token.repository.js";
import {
  createRefreshTokenBodySchema,
  revokeRefreshTokenBodySchema,
} from "./refresh-token.schemas.js";

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
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createRefreshToken(body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createRefreshTokenBodySchema, body);
    return refreshTokenRepository.createRefreshToken(parsed, opts);
  }, options);
}

/**
 * @param {number} id
 */
export async function getRefreshToken(id) {
  return refreshTokenRepository.getRefreshToken(id);
}

/**
 * @param {number} id
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function deleteRefreshToken(id, options = {}) {
  return withTransaction(
    (opts) => refreshTokenRepository.deleteRefreshToken(id, opts),
    options,
  );
}

/**
 * @param {unknown} body
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function revokeRefreshToken(body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(revokeRefreshTokenBodySchema, body);
    return refreshTokenRepository.revokeRefreshToken(parsed.token, opts);
  }, options);
}
