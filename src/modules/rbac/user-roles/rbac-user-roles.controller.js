import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacUserRolesService from "./rbac-user-roles.service.js";

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
export async function listUserRoles(req, res) {
  const userId = parsePathInt(req.params.userId);
  if (userId === null) {
    return sendValidationError(res, { message: "Invalid userId" });
  }
  try {
    const rows = await rbacUserRolesService.listUserRoles(userId);
    return sendSuccess(res, {
      message: "User roles fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("listUserRoles:", err);
    return sendError(res, {
      message: "Failed to list user roles",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function setUserRoles(req, res) {
  const userId = parsePathInt(req.params.userId);
  if (userId === null) {
    return sendValidationError(res, { message: "Invalid userId" });
  }
  try {
    const rows = await rbacUserRolesService.setUserRoles(userId, req.body);
    if (!rows) {
      return sendError(res, { message: "User not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User roles updated successfully",
      data: rows,
    });
  } catch (err) {
    console.error("setUserRoles:", err);
    if (
      err instanceof ForeignKeyConstraintError ||
      err.name === "SequelizeForeignKeyConstraintError"
    ) {
      return sendValidationError(res, { message: "One or more role ids do not exist" });
    }
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "Duplicate role id in request",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to set user roles",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUserRole(req, res) {
  const userId = parsePathInt(req.params.userId);
  if (userId === null) {
    return sendValidationError(res, { message: "Invalid userId" });
  }
  try {
    const row = await rbacUserRolesService.createUserRole(userId, req.body);
    return sendSuccess(res, {
      message: "Role assigned to user successfully",
      statusCode: 201,
      data: row,
    });
  } catch (err) {
    console.error("createUserRole:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "This role is already assigned to the user",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to assign role to user",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteUserRole(req, res) {
  const userId = parsePathInt(req.params.userId);
  const roleId = parsePathInt(req.params.roleId);
  if (userId === null || roleId === null) {
    return sendValidationError(res, { message: "Invalid userId or roleId" });
  }
  try {
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
  } catch (err) {
    console.error("deleteUserRole:", err);
    return sendError(res, {
      message: "Failed to remove user role",
      statusCode: 500,
    });
  }
}
