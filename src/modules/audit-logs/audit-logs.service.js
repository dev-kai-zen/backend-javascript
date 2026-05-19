import { withTransaction } from "../../shared/db/with-transaction.js";
import { parseInput } from "../../shared/validation/parse-input.js";
import * as auditLogsRepository from "./audit-logs.repository.js";
import { createAuditLogsBodySchema } from "./audit-logs.schemas.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/**
 * @param {string | undefined} raw
 * @returns {number | undefined}
 */
function parseOptionalNonNegInt(raw) {
  if (raw === undefined || raw === "") {
    return undefined;
  }
  const n = Number.parseInt(String(raw), 10);
  if (Number.isFinite(n) && n >= 0) {
    return n;
  }
  return undefined;
}

/**
 * @param {string | undefined} action
 * @param {string | undefined} entity_type
 * @param {string | undefined} limit
 * @param {string | undefined} offset
 */
export async function listAuditLogs(action, entity_type, limit, offset) {
  let lim = parseOptionalNonNegInt(limit) ?? DEFAULT_LIMIT;
  if (lim > MAX_LIMIT) {
    lim = MAX_LIMIT;
  }
  const off = parseOptionalNonNegInt(offset) ?? 0;

  /** @type {{ action?: string; entity_type?: string }} */
  const filters = {};
  if (typeof action === "string" && action !== "") {
    filters.action = action;
  }
  if (typeof entity_type === "string" && entity_type !== "") {
    filters.entity_type = entity_type;
  }

  return auditLogsRepository.listAuditLogs(filters, { limit: lim, offset: off });
}

/**
 * @param {unknown} body
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createAuditLogs(body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createAuditLogsBodySchema, body);
    const logs = parsed.logs.map((item) => ({
      user_id: item.user_id ?? null,
      action: item.action,
      entity_type: item.entity_type,
      entity_id: item.entity_id ?? null,
      old_values: item.old_values ?? null,
      new_values: item.new_values ?? null,
      change_fields: item.change_fields ?? null,
      ip_address: item.ip_address ?? null,
      user_agent: item.user_agent ?? null,
      timestamp: item.timestamp,
    }));
    return auditLogsRepository.createAuditLogs(logs, opts);
  }, options);
}
