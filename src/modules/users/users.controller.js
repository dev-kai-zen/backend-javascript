
import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as usersService from "./users.service.js";
import { asyncHandler } from "../../shared/middlewares/async-handler.js";

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
export const createUser = asyncHandler(async (req, res) => {
    const user = await usersService.createUser(req.body);
    return sendSuccess(res, {
      message: "User created successfully",
      statusCode: 201,
      data: user,
    });
  },
  {
    defaultMessage: "Failed to create user",
    defaultStatusCode: 500,
  } 
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getUsers = asyncHandler(async (req, res) => {
    const users = await usersService.getUsers(req.query.limit, req.query.offset);
    return sendSuccess(res, {
      message: "Users fetched successfully",
      data: users,
    });
  },
  {
    defaultMessage: "Failed to list users",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getUserById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "invalid id" });
  }
    const user = await usersService.getUserById(id);
    if (!user) {
      return sendError(res, { message: "user not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User fetched successfully",
      data: user,
    });
  },
  {
    defaultMessage: "Failed to load user",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateUser = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "invalid id" });
  }
    const user = await usersService.updateUser(id, req.body);
    if (!user) {
      return sendError(res, { message: "user not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User updated successfully",
      data: user,
    });
  },
  {
    defaultMessage: "Failed to update user",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "invalid id" });
  }
    const ok = await usersService.deleteUser(id);
    if (!ok) {
      return sendError(res, { message: "user not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "User deleted successfully",
      data: null,
    });
  },
  {
    defaultMessage: "Failed to delete user",
    defaultStatusCode: 500,
  },
);
