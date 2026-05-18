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
    return res.json({ data: logs });
  } catch (err) {
    console.error("listAuditLogs:", err);
    return res.status(500).json({
      message: "Failed to list audit logs",
    });
  }
};
