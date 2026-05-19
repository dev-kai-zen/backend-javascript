import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacRolePermissionsService from "./rbac-role-permissions.service.js";

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
export async function listRolePermissions(req, res) {
  const roleId = parsePathId(req.params.id);
  if (roleId === null) {
    return sendValidationError(res, { message: "Invalid role id" });
  }
  try {
    const rows = await rbacRolePermissionsService.listRolePermissions(roleId);
    return sendSuccess(res, {
      message: "Role permissions fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("listRolePermissions:", err);
    return sendError(res, {
      message: "Failed to list role permissions",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function setRolePermissions(req, res) {
  const roleId = parsePathId(req.params.id);
  if (roleId === null) {
    return sendValidationError(res, { message: "Invalid role id" });
  }
  try {
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
  } catch (err) {
    console.error("setRolePermissions:", err);
    if (
      err instanceof ForeignKeyConstraintError ||
      err.name === "SequelizeForeignKeyConstraintError"
    ) {
      return sendValidationError(res, { message: "One or more permission ids do not exist" });
    }
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "Duplicate permission id in request",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to set role permissions",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createRolePermission(req, res) {
  const roleId = parsePathId(req.params.id);
  if (roleId === null) {
    return sendValidationError(res, { message: "Invalid role id" });
  }
  try {
    const row = await rbacRolePermissionsService.createRolePermission(
      roleId,
      req.body,
    );
    return sendSuccess(res, {
      message: "Permission assigned to role successfully",
      statusCode: 201,
      data: row,
    });
  } catch (err) {
    console.error("createRolePermission:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "This permission is already assigned to the role",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to assign permission to role",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteRolePermission(req, res) {
  const roleId = parsePathId(req.params.id);
  const permissionId = parsePathId(req.params.permissionId);
  if (roleId === null || permissionId === null) {
    return sendValidationError(res, { message: "Invalid role id or permissionId" });
  }
  try {
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
  } catch (err) {
    console.error("deleteRolePermission:", err);
    return sendError(res, {
      message: "Failed to remove role permission",
      statusCode: 500,
    });
  }
}
