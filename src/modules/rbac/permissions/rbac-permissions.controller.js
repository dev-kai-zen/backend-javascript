import { UniqueConstraintError } from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacPermissionsService from "./rbac-permissions.service.js";

/**
 * @param {unknown} val
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
 * @param {string | undefined} categoryIdRaw
 */
function parseListCategoryId(categoryIdRaw) {
  if (typeof categoryIdRaw !== "string" || categoryIdRaw.trim() === "") {
    return {};
  }
  const n = Number.parseInt(categoryIdRaw.trim(), 10);
  return { categoryId: Number.isFinite(n) ? n : undefined };
}

/**
 * @param {unknown} raw
 */
function parsePathId(raw) {
  const id = typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(id) ? id : null;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function listPermissions(req, res) {
  const { categoryId } = parseListCategoryId(
    firstQueryString(req.query.categoryId),
  );
  /** @type {{ categoryId?: number }} */
  const filters = {};
  if (categoryId !== undefined) {
    filters.categoryId = categoryId;
  }
  try {
    const rows = await rbacPermissionsService.listPermissions(filters);
    return sendSuccess(res, {
      message: "Permissions fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("listPermissions:", err);
    return sendError(res, {
      message: "Failed to list permissions",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createPermission(req, res) {
  try {
    const row = await rbacPermissionsService.createPermission(req.body);
    return sendSuccess(res, {
      message: "Permission created successfully",
      statusCode: 201,
      data: row,
    });
  } catch (err) {
    console.error("createPermission:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "permissionCode already exists",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to create permission",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getPermission(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const row = await rbacPermissionsService.getPermission(id);
    if (!row) {
      return sendError(res, { message: "Permission not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Permission fetched successfully",
      data: row,
    });
  } catch (err) {
    console.error("getPermission:", err);
    return sendError(res, {
      message: "Failed to get permission",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updatePermission(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const row = await rbacPermissionsService.updatePermission(id, req.body);
    if (!row) {
      return sendError(res, { message: "Permission not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Permission updated successfully",
      data: row,
    });
  } catch (err) {
    console.error("updatePermission:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "permissionCode already exists",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to update permission",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deletePermission(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const deleted = await rbacPermissionsService.deletePermission(id);
    if (!deleted) {
      return sendError(res, { message: "Permission not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Permission deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("deletePermission:", err);
    return sendError(res, {
      message: "Failed to delete permission",
      statusCode: 500,
    });
  }
}
