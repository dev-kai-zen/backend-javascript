import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../shared/http/api-response.js";
import * as auditLogsService from "./audit-logs.service.js";

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
export async function listAuditLogs(req, res) {
  try {
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
  } catch (err) {
    console.error("listAuditLogs:", err);
    return sendError(res, {
      message: "Failed to list audit logs",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createAuditLogs(req, res) {
  try {
    const rows = await auditLogsService.createAuditLogs(req.body);
    return sendSuccess(res, {
      message: "Audit logs created successfully",
      statusCode: 201,
      data: rows,
    });
  } catch (err) {
    console.error("createAuditLogs:", err);
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to create audit logs",
      statusCode: 500,
    });
  }
}
