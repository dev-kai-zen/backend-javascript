import { UniqueConstraintError } from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as refreshTokenService from "./refresh-token.service.js";

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
    const filters = refreshTokenService.parseListFilters(
      firstQueryString(req.query.userId),
    );
    const rows = await refreshTokenService.listRefreshTokens(filters);
    return sendSuccess(res, {
      message: "Refresh tokens fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("listRefreshTokens:", err);
    return sendError(res, {
      message: "Failed to list refresh tokens",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createRefreshToken(req, res) {
  try {
    const row = await refreshTokenService.createRefreshToken(req.body);
    return sendSuccess(res, {
      message: "Refresh token created successfully",
      statusCode: 201,
      data: row,
    });
  } catch (err) {
    console.error("createRefreshToken:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "token value already exists",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to create refresh token",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRefreshToken(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const row = await refreshTokenService.getRefreshToken(id);
    if (!row) {
      return sendError(res, {
        message: "Refresh token not found",
        statusCode: 404,
      });
    }
    return sendSuccess(res, {
      message: "Refresh token fetched successfully",
      data: row,
    });
  } catch (err) {
    console.error("getRefreshToken:", err);
    return sendError(res, {
      message: "Failed to get refresh token",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteRefreshToken(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const deleted = await refreshTokenService.deleteRefreshToken(id);
    if (!deleted) {
      return sendError(res, {
        message: "Refresh token not found",
        statusCode: 404,
      });
    }
    return sendSuccess(res, {
      message: "Refresh token deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("deleteRefreshToken:", err);
    return sendError(res, {
      message: "Failed to delete refresh token",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function revokeRefreshToken(req, res) {
  try {
    const deleted = await refreshTokenService.revokeRefreshToken(req.body);
    if (!deleted) {
      return sendError(res, {
        message: "Refresh token not found",
        statusCode: 404,
      });
    }
    return sendSuccess(res, {
      message: "Refresh token revoked successfully",
      data: null,
    });
  } catch (err) {
    console.error("revokeRefreshToken:", err);
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to revoke refresh token",
      statusCode: 500,
    });
  }
}
