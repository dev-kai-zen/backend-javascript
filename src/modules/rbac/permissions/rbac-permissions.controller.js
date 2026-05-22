
import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacPermissionsService from "./rbac-permissions.service.js";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";

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
export const listPermissions = asyncHandler(async (req, res) => {
  const { categoryId } = parseListCategoryId(
    firstQueryString(req.query.categoryId),
  );
  /** @type {{ categoryId?: number }} */
  const filters = {};
  if (categoryId !== undefined) {
    filters.categoryId = categoryId;
  }
    const rows = await rbacPermissionsService.listPermissions(filters);
    return sendSuccess(res, {
      message: "Permissions fetched successfully",
      data: rows,
    });
  },
  {
    defaultMessage: "Failed to list permissions",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createPermission = asyncHandler(async (req, res) => {
    const row = await rbacPermissionsService.createPermission(req.body);
    return sendSuccess(res, {
      message: "Permission created successfully",
      statusCode: 201,
      data: row,
    });
  },
  {
    defaultMessage: "Failed to create permission",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPermission = asyncHandler(async (req, res) => {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
    const row = await rbacPermissionsService.getPermission(id);
    if (!row) {
      return sendError(res, { message: "Permission not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Permission fetched successfully",
      data: row,
    });
  },
  {
    defaultMessage: "Failed to get permission",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updatePermission = asyncHandler(async (req, res) => {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
    const row = await rbacPermissionsService.updatePermission(id, req.body);
    if (!row) {
      return sendError(res, { message: "Permission not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Permission updated successfully",
      data: row,
    });
  },
  {
    defaultMessage: "Failed to update permission",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deletePermission = asyncHandler(async (req, res) => {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
    const deleted = await rbacPermissionsService.deletePermission(id);
    if (!deleted) {
      return sendError(res, { message: "Permission not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Permission deleted successfully",
      data: null,
    });
  },
  {
    defaultMessage: "Failed to delete permission",
    defaultStatusCode: 500,
  },
);
