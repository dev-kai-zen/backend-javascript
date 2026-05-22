import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as userLogsService from "./user-logs.service.js";
import { asyncHandler } from "../../shared/middlewares/async-handler.js";

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
export const listUserLogs = asyncHandler(async (req, res) => {
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
  },
  {
    defaultMessage: "Failed to list user logs",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createUserLog = asyncHandler(async (req, res) => {
    const log = await userLogsService.createUserLog(req.body);
    return sendSuccess(res, {
      message: "User log created successfully",
      statusCode: 201,
      data: log,
    });
  },
  {
    defaultMessage: "Failed to create user log",
    defaultStatusCode: 500,
  },
);
