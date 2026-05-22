import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacRolePermissionsService from "./rbac-role-permissions.service.js";
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
export const listRolePermissions = asyncHandler(
  async (req, res) => {
    const roleId = parsePathId(req.params.id);
    if (roleId === null) {
      return sendValidationError(res, { message: "Invalid role id" });
    }
    const rows = await rbacRolePermissionsService.listRolePermissions(roleId);
    return sendSuccess(res, {
      message: "Role permissions fetched successfully",
      data: rows,
    });
  },
  {
    defaultMessage: "Failed to list role permissions",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const setRolePermissions = asyncHandler(
  async (req, res) => {
    const roleId = parsePathId(req.params.id);
    if (roleId === null) {
      return sendValidationError(res, { message: "Invalid role id" });
    }
    const rows = await rbacRolePermissionsService.setRolePermissions(
      roleId,
      req.body,
    );
    if (!rows) {
      return sendError(res, { message: "Role not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Role permissions updated successfully",
      data: rows,
    });
  },
  {
    defaultMessage: "Failed to set role permissions",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createRolePermission = asyncHandler(
  async (req, res) => {
    const roleId = parsePathId(req.params.id);
    if (roleId === null) {
      return sendValidationError(res, { message: "Invalid role id" });
    }
    const row = await rbacRolePermissionsService.createRolePermission(
      roleId,
      req.body,
    );
    return sendSuccess(res, {
      message: "Permission assigned to role successfully",
      statusCode: 201,
      data: row,
    });
  },
  {
    defaultMessage: "Failed to create role permission",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteRolePermission = asyncHandler(
  async (req, res) => {
    const roleId = parsePathId(req.params.id);
    const permissionId = parsePathId(req.params.permissionId);
    if (roleId === null || permissionId === null) {
      return sendValidationError(res, {
        message: "Invalid role id or permissionId",
      });
    }
    const deleted = await rbacRolePermissionsService.deleteRolePermission(
      roleId,
      permissionId,
    );
    if (!deleted) {
      return sendError(res, {
        message: "Role permission link not found",
        statusCode: 404,
      });
    }
    return sendSuccess(res, {
      message: "Role permission removed successfully",
      data: null,
    });
  },
  {
    defaultMessage: "Failed to remove role permission",
    defaultStatusCode: 500,
  },
);
