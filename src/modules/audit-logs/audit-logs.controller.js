import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as auditLogsService from "./audit-logs.service.js";
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
export const listAuditLogs = asyncHandler(
  async (req, res) => {
    const logs = await auditLogsService.listAuditLogs(
      firstQueryString(req.query.action),
      firstQueryString(req.query.entity_type),
      firstQueryString(req.query.limit),
      firstQueryString(req.query.offset),
    );
    return sendSuccess(res, {
      message: "Audit logs fetched successfully",
      data: logs,
    });
  },
  {
    defaultMessage: "Failed to fetch audit logs",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createAuditLogs = asyncHandler(async (req, res) => {
    const rows = await auditLogsService.createAuditLogs(req.body);
    return sendSuccess(res, {
      message: "Audit logs created successfully",
      statusCode: 201,
      data: rows,
    });
    },
  {
    defaultMessage: "Failed to create audit logs",
    defaultStatusCode: 500,
  },
);
