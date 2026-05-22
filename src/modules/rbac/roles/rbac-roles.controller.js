
import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacRolesService from "./rbac-roles.service.js";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";

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
export const listRoles = asyncHandler(async (_req, res) => {
    const roles = await rbacRolesService.listRoles();
    return sendSuccess(res, {
      message: "Roles fetched successfully",
      data: roles,
    });
  },
  {
    defaultMessage: "Failed to list roles",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createRole = asyncHandler(async (req, res) => {
    const role = await rbacRolesService.createRole(req.body);
    return sendSuccess(res, {
      message: "Role created successfully",
      statusCode: 201,
      data: role,
    });
  },
  {
    defaultMessage: "Failed to create role",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRole = asyncHandler(async (req, res) => {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
    const role = await rbacRolesService.getRole(id);
    if (!role) {
      return sendError(res, { message: "Role not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Role fetched successfully",
      data: role,
    });
  },
  {
    defaultMessage: "Failed to get role",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateRole = asyncHandler(async (req, res) => {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
    const role = await rbacRolesService.updateRole(id, req.body);
    if (!role) {
      return sendError(res, { message: "Role not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Role updated successfully",
      data: role,
    });
  },
  {
    defaultMessage: "Failed to update role",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
    const deleted = await rbacRolesService.deleteRole(id);
    if (!deleted) {
      return sendError(res, { message: "Role not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Role deleted successfully",
      data: null,
    });
  },
  {
    defaultMessage: "Failed to delete role",
    defaultStatusCode: 500,
  },
);
