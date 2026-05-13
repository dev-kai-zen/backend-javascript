import jwt from "jsonwebtoken";

import { env } from "../../config/env-config.js";

/** Short-lived API access (sent in `Authorization` header). */
const ACCESS_EXPIRES_IN = "15m";

/** Long-lived rotation token (sent only as an httpOnly cookie from the backend). */
const REFRESH_EXPIRES_IN = "30d";

export function getJwtSecret() {
  return env.jwtSecret;
}

export function signAccessToken(userId, roles, permissions) {
  const secret = getJwtSecret();
  const payload = {
    sub: userId,
    typ: "access",
    roles,
    permissions,
  };
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(userId) {
  const secret = getJwtSecret();
  const payload = { sub: userId, typ: "refresh" };
  return jwt.sign(payload, secret, { expiresIn: REFRESH_EXPIRES_IN });
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function asStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item) => typeof item === "string");
}

/**
 * Validates the access token and returns the signed payload (user id, roles, permissions).
 * @param {string} token
 * @returns {{ sub: number; typ: "access"; roles: string[]; permissions: string[] }}
 * @throws {Error} If the token is invalid, expired, or `sub` is not a finite number.
 */
export function verifyAccessTokenPayload(token) {
  const secret = getJwtSecret();
  const decoded = /** @type {Record<string, unknown>} */ (
    jwt.verify(token, secret)
  );
  if (decoded.typ !== "access") {
    throw new Error("Invalid access token");
  }
  const id =
    typeof decoded.sub === "number"
      ? decoded.sub
      : typeof decoded.sub === "string"
        ? Number.parseInt(decoded.sub, 10)
        : Number.NaN;
  if (!Number.isFinite(id)) {
    throw new Error("Invalid token subject");
  }
  return {
    sub: id,
    typ: "access",
    roles: asStringArray(decoded.roles),
    permissions: asStringArray(decoded.permissions),
  };
}

/**
 * @param {string} token
 * @returns {number}
 */
export function verifyAccessToken(token) {
  return verifyAccessTokenPayload(token).sub;
}

/**
 * @param {string} token
 * @returns {number}
 */
export function verifyRefreshToken(token) {
  const secret = getJwtSecret();
  const decoded = /** @type {{ sub?: unknown; typ?: unknown }} */ (
    jwt.verify(token, secret)
  );
  if (decoded.typ !== "refresh") {
    throw new Error("Invalid refresh token");
  }
  const id =
    typeof decoded.sub === "number"
      ? decoded.sub
      : typeof decoded.sub === "string"
        ? Number.parseInt(decoded.sub, 10)
        : Number.NaN;
  if (!Number.isFinite(id)) {
    throw new Error("Invalid token subject");
  }
  return id;
}
