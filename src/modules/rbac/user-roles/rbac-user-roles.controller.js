
import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacUserRolesService from "./rbac-user-roles.service.js";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";

/**
 * @param {unknown} raw
 */
function parsePathInt(raw) {
  const id = typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(id) ? id : null;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const listUserRoles = asyncHandler(
  async (req, res) => {
    const userId = parsePathInt(req.params.userId);
    if (userId === null) {
      return sendValidationError(res, { message: "Invalid userId" });
    }
    const rows = await rbacUserRolesService.listUserRoles(userId);
    return sendSuccess(res, {
      message: "User roles fetched successfully",
      data: rows,
    });
  },
  {
    defaultMessage: "Failed to list user roles",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const setUserRoles = asyncHandler(
  async (req, res) => {
    const userId = parsePathInt(req.params.userId);
    if (userId === null) {
      return sendValidationError(res, { message: "Invalid userId" });
    }
    const rows = await rbacUserRolesService.setUserRoles(userId, req.body);
    if (!rows) {
      return sendError(res, { message: "User not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User roles updated successfully",
      data: rows,
    });
  },
  {
    defaultMessage: "Failed to set user roles",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createUserRole = asyncHandler(
  async (req, res) => {
    const userId = parsePathInt(req.params.userId);
    if (userId === null) {
      return sendValidationError(res, { message: "Invalid userId" });
    }
    const row = await rbacUserRolesService.createUserRole(userId, req.body);
    return sendSuccess(res, {
      message: "Role assigned to user successfully",
      statusCode: 201,
      data: row,
    });
  },
  {
    defaultMessage: "Failed to assign role to user",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteUserRole = asyncHandler(
  async (req, res) => {
    const userId = parsePathInt(req.params.userId);
    const roleId = parsePathInt(req.params.roleId);
    if (userId === null || roleId === null) {
      return sendValidationError(res, { message: "Invalid userId or roleId" });
    }
    const deleted = await rbacUserRolesService.deleteUserRole(userId, roleId);
    if (!deleted) {
      return sendError(res, {
        message: "User role link not found",
        statusCode: 404,
      });
    }
    return sendSuccess(res, {
      message: "User role removed successfully",
      data: null,
    });
  },
  {
    defaultMessage: "Failed to remove user role",
    defaultStatusCode: 500,
  },
);
