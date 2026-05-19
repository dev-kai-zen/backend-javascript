import { UniqueConstraintError } from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as usersService from "./users.service.js";

/**
 * @param {unknown} raw
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
export async function createUser(req, res) {
  try {
    const user = await usersService.createUser(req.body);
    return sendSuccess(res, {
      message: "User created successfully",
      statusCode: 201,
      data: user,
    });
  } catch (err) {
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "email or google_id is already taken",
        statusCode: 409,
      });
    }
    const message =
      err instanceof Error ? err.message : "failed to create user";
    return sendValidationError(res, { message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUsers(req, res) {
  try {
    const users = await usersService.getUsers(req.query.limit, req.query.offset);
    return sendSuccess(res, {
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to list users";
    return sendValidationError(res, { message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUserById(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "invalid id" });
  }
  try {
    const user = await usersService.getUserById(id);
    if (!user) {
      return sendError(res, { message: "user not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to load user";
    return sendValidationError(res, { message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateUser(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "invalid id" });
  }
  try {
    const user = await usersService.updateUser(id, req.body);
    if (!user) {
      return sendError(res, { message: "user not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "email or google_id is already taken",
        statusCode: 409,
      });
    }
    const message =
      err instanceof Error ? err.message : "failed to update user";
    return sendValidationError(res, { message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteUser(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "invalid id" });
  }
  try {
    const ok = await usersService.deleteUser(id);
    if (!ok) {
      return sendError(res, { message: "user not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User deleted successfully",
      data: null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "failed to delete user";
    return sendValidationError(res, { message });
  }
}
