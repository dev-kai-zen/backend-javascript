import { AuditLog } from "./audit-logs.model.js";

/**
 * @param {{ action?: string; entity_type?: string }} filters
 * @param {{ limit: number; offset: number }} options
 * @returns {Promise<import("./audit-logs.model.js").AuditLog[]>}
 */
export async function listAuditLogs(filters, options) {
  /** @type {Record<string, unknown>} */
  const where = {};
  if (filters.action !== undefined && filters.action !== "") {
    where.action = filters.action;
  }
  if (filters.entity_type !== undefined && filters.entity_type !== "") {
    where.entity_type = filters.entity_type;
  }

  return AuditLog.findAll({
    where,
    limit: options.limit,
    offset: options.offset,
    order: [["created_at", "DESC"]],
  });
}

/**
 * @param {{
 *   user_id?: number | null;
 *   action: string;
 *   entity_type: string;
 *   entity_id?: string | null;
 *   old_values?: Record<string, unknown> | null;
 *   new_values?: Record<string, unknown> | null;
 *   change_fields?: string[] | null;
 *   ip_address?: string | null;
 *   user_agent?: string | null;
 *   timestamp?: Date;
 * }} input
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<import("./audit-logs.model.js").AuditLog>}
 */
export async function createAuditLog(input, options = {}) {
  return AuditLog.create(
    {
      user_id: input.user_id ?? null,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      old_values: input.old_values ?? null,
      new_values: input.new_values ?? null,
      change_fields: input.change_fields ?? null,
      ip_address: input.ip_address ?? null,
      user_agent: input.user_agent ?? null,
      timestamp: input.timestamp ?? new Date(),
    },
    options,
  );
}

/**
 * @param {Array<{
 *   user_id?: number | null;
 *   action: string;
 *   entity_type: string;
 *   entity_id?: string | null;
 *   old_values?: Record<string, unknown> | null;
 *   new_values?: Record<string, unknown> | null;
 *   change_fields?: string[] | null;
 *   ip_address?: string | null;
 *   user_agent?: string | null;
 *   timestamp?: Date;
 * }>} inputs
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 * @returns {Promise<import("./audit-logs.model.js").AuditLog[]>}
 */
export async function createAuditLogs(inputs, options = {}) {
  if (inputs.length === 0) {
    return [];
  }
  return AuditLog.bulkCreate(
    inputs.map((input) => ({
      user_id: input.user_id ?? null,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      old_values: input.old_values ?? null,
      new_values: input.new_values ?? null,
      change_fields: input.change_fields ?? null,
      ip_address: input.ip_address ?? null,
      user_agent: input.user_agent ?? null,
      timestamp: input.timestamp ?? new Date(),
    })),
    { ...options, validate: true },
  );
}
