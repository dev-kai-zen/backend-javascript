import { UniqueConstraintError } from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacRolesService from "./rbac-roles.service.js";

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
export async function listRoles(_req, res) {
  try {
    const roles = await rbacRolesService.listRoles();
    return sendSuccess(res, {
      message: "Roles fetched successfully",
      data: roles,
    });
  } catch (err) {
    console.error("listRoles:", err);
    return sendError(res, { message: "Failed to list roles", statusCode: 500 });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createRole(req, res) {
  try {
    const role = await rbacRolesService.createRole(req.body);
    return sendSuccess(res, {
      message: "Role created successfully",
      statusCode: 201,
      data: role,
    });
  } catch (err) {
    console.error("createRole:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "roleName already exists",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, { message: "Failed to create role", statusCode: 500 });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRole(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const role = await rbacRolesService.getRole(id);
    if (!role) {
      return sendError(res, { message: "Role not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Role fetched successfully",
      data: role,
    });
  } catch (err) {
    console.error("getRole:", err);
    return sendError(res, { message: "Failed to get role", statusCode: 500 });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateRole(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const role = await rbacRolesService.updateRole(id, req.body);
    if (!role) {
      return sendError(res, { message: "Role not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Role updated successfully",
      data: role,
    });
  } catch (err) {
    console.error("updateRole:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "roleName already exists",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, { message: "Failed to update role", statusCode: 500 });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteRole(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const deleted = await rbacRolesService.deleteRole(id);
    if (!deleted) {
      return sendError(res, { message: "Role not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Role deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("deleteRole:", err);
    return sendError(res, { message: "Failed to delete role", statusCode: 500 });
  }
}
