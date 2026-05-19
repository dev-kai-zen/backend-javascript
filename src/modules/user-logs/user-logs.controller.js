import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as userLogsService from "./user-logs.service.js";

/**
 * @param {unknown} val
 * @returns {string | undefined}
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
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function listUserLogs(req, res) {
  try {
    const logs = await userLogsService.listUserLogs(
      firstQueryString(req.query.userId),
      firstQueryString(req.query.action),
      firstQueryString(req.query.module),
      firstQueryString(req.query.limit),
      firstQueryString(req.query.offset),
    );
    return sendSuccess(res, {
      message: "User logs fetched successfully",
      data: logs,
    });
  } catch (err) {
    console.error("listUserLogs:", err);
    return sendError(res, {
      message: "Failed to list user logs",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUserLog(req, res) {
  try {
    const log = await userLogsService.createUserLog(req.body);
    return sendSuccess(res, {
      message: "User log created successfully",
      statusCode: 201,
      data: log,
    });
  } catch (err) {
    console.error("createUserLog:", err);
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to create user log",
      statusCode: 500,
    });
  }
}
