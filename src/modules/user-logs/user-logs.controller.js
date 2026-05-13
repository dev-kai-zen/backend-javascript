import {
  createUserLog as createUserLogService,
  listUserLogs as listUserLogsService,
} from "./user-logs.service.js";

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
    const logs = await listUserLogsService(
      firstQueryString(req.query.userId),
      firstQueryString(req.query.action),
      firstQueryString(req.query.module),
      firstQueryString(req.query.limit),
      firstQueryString(req.query.offset),
    );
    return res.json({ data: logs });
  } catch (err) {
    console.error("listUserLogs:", err);
    return res.status(500).json({ message: "Failed to list user logs" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUserLog(req, res) {
  try {
    const log = await createUserLogService(req.body);
    return res.status(201).json(log);
  } catch (err) {
    console.error("createUserLog:", err);
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to create user log" });
  }
}
