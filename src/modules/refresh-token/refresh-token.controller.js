import { UniqueConstraintError } from "sequelize";

import {
  createRefreshToken as createRefreshTokenService,
  deleteRefreshToken as deleteRefreshTokenService,
  getRefreshToken as getRefreshTokenService,
  listRefreshTokens as listRefreshTokensService,
  parseListFilters,
  revokeRefreshToken as revokeRefreshTokenService,
} from "./refresh-token.service.js";

/**
 * @param {unknown} val
 * @returns {string | undefined}
 */
function firstQueryString(val) {
  if (typeof val === "string") {
    return val;
  }
  if (Array.isArray(val) && typeof val[0] === "string") {
    return val[0];
  }
  return undefined;
}

/**
 * @param {unknown} raw
 * @returns {number | null}
 */
function parseId(raw) {
  const id = Number.parseInt(String(raw), 10);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function listRefreshTokens(req, res) {
  try {
    const filters = parseListFilters(firstQueryString(req.query.userId));
    const rows = await listRefreshTokensService(filters);
    return res.json({ data: rows });
  } catch (err) {
    console.error("listRefreshTokens:", err);
    return res.status(500).json({ message: "Failed to list refresh tokens" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createRefreshToken(req, res) {
  try {
    const row = await createRefreshTokenService(req.body);
    return res.status(201).json(row);
  } catch (err) {
    console.error("createRefreshToken:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "token value already exists" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to create refresh token" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRefreshToken(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const row = await getRefreshTokenService(id);
    if (!row) {
      return res.status(404).json({ message: "Refresh token not found" });
    }
    return res.json(row);
  } catch (err) {
    console.error("getRefreshToken:", err);
    return res.status(500).json({ message: "Failed to get refresh token" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteRefreshToken(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const deleted = await deleteRefreshTokenService(id);
    if (!deleted) {
      return res.status(404).json({ message: "Refresh token not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("deleteRefreshToken:", err);
    return res.status(500).json({ message: "Failed to delete refresh token" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function revokeRefreshToken(req, res) {
  try {
    const deleted = await revokeRefreshTokenService(req.body);
    if (!deleted) {
      return res.status(404).json({ message: "Refresh token not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("revokeRefreshToken:", err);
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to revoke refresh token" });
  }
}
