import { UniqueConstraintError } from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as refreshTokenService from "./refresh-token.service.js";
import { asyncHandler } from "../../shared/middlewares/async-handler.js";

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
export const listRefreshTokens = asyncHandler(async (req, res) => {
    const filters = refreshTokenService.parseListFilters(
      firstQueryString(req.query.userId),
    );
    const rows = await refreshTokenService.listRefreshTokens(filters);
    return sendSuccess(res, {
      message: "Refresh tokens fetched successfully",
      data: rows,
    });
},
  {
    defaultMessage: "Failed to list refresh tokens",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createRefreshToken = asyncHandler(async (req, res) => {
    const row = await refreshTokenService.createRefreshToken(req.body);
    return sendSuccess(res, {
      message: "Refresh token created successfully",
      statusCode: 201,
      data: row,
    });
},
  {
    defaultMessage: "Failed to create refresh token",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRefreshToken = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
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
},
  {
    defaultMessage: "Failed to get refresh token",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteRefreshToken = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
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
  },
  {
    defaultMessage: "Failed to delete refresh token",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const revokeRefreshToken = asyncHandler(async (req, res) => {
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
  },
  {
    defaultMessage: "Failed to revoke refresh token",
    defaultStatusCode: 500,
  },
);
