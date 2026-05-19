import { UserLog } from "./user-logs.model.js";

/**
 * @param {{ userId?: number; action?: string; module?: string }} filters
 * @param {{ limit: number; offset: number }} options
 * @returns {Promise<import("./user-logs.model.js").UserLog[]>}
 */
export async function listUserLogs(filters, options) {
  /** @type {Record<string, unknown>} */
  const where = {};
  if (filters.userId !== undefined && Number.isFinite(filters.userId)) {
    where.user_id = filters.userId;
  }
  if (filters.action !== undefined && filters.action !== "") {
    where.action = filters.action;
  }
  if (filters.module !== undefined && filters.module !== "") {
    where.module = filters.module;
  }

  return UserLog.findAll({
    where,
    limit: options.limit,
    offset: options.offset,
    order: [["created_at", "DESC"]],
  });
}

/**
 * @param {{
 *   userId: number | null;
 *   action: string;
 *   module: string | null;
 *   description: string | null;
 *   method: string | null;
 *   route: string | null;
 *   statusCode: number | null;
 *   ipAddress: string | null;
 *   userAgent: string | null;
 *   deviceType: string | null;
 *   browser: string | null;
 *   os: string | null;
 *   sessionId: string | null;
 *   metadata: Record<string, unknown> | null;
 * }} input
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<import("./user-logs.model.js").UserLog>}
 */
export async function createUserLog(input, options = {}) {
  return UserLog.create(
    {
      user_id: input.userId,
      action: input.action,
      module: input.module,
      description: input.description,
      method: input.method,
      route: input.route,
      status_code: input.statusCode,
      ip_address: input.ipAddress,
      user_agent: input.userAgent,
      device_type: input.deviceType,
      browser: input.browser,
      os: input.os,
      session_id: input.sessionId,
      metadata: input.metadata,
    },
    options,
  );
}
