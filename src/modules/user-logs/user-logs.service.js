import { withTransaction } from "../../shared/db/with-transaction.js";
import { parseInput } from "../../shared/validation/parse-input.js";
import * as userLogsRepository from "./user-logs.repository.js";
import { createUserLogBodySchema } from "./user-logs.schemas.js";

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
 * @param {string | undefined} raw
 * @returns {number | undefined}
 */
function parseOptionalUserId(raw) {
  if (raw === undefined) {
    return undefined;
  }
  const trimmed = String(raw).trim();
  if (trimmed === "") {
    return undefined;
  }
  const n = Number.parseInt(trimmed, 10);
  if (Number.isFinite(n)) {
    return n;
  }
  return undefined;
}

/**
 * @param {string | undefined} raw
 * @returns {string | undefined}
 */
function trimmedOrUndefined(raw) {
  if (typeof raw !== "string") {
    return undefined;
  }
  const t = raw.trim();
  return t === "" ? undefined : t;
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function nullableString(value) {
  return typeof value === "string" ? value : null;
}

/**
 * @param {string | undefined} userId
 * @param {string | undefined} action
 * @param {string | undefined} moduleName
 * @param {string | undefined} limit
 * @param {string | undefined} offset
 */
export async function listUserLogs(
  userId,
  action,
  moduleName,
  limit,
  offset,
) {
  let lim = parseOptionalNonNegInt(limit) ?? DEFAULT_LIMIT;
  if (lim > MAX_LIMIT) {
    lim = MAX_LIMIT;
  }
  const off = parseOptionalNonNegInt(offset) ?? 0;

  /** @type {{ userId?: number; action?: string; module?: string }} */
  const filters = {};
  const uid = parseOptionalUserId(userId);
  if (uid !== undefined) {
    filters.userId = uid;
  }
  const act = trimmedOrUndefined(action);
  if (act !== undefined) {
    filters.action = act;
  }
  const mod = trimmedOrUndefined(moduleName);
  if (mod !== undefined) {
    filters.module = mod;
  }

  return userLogsRepository.listUserLogs(filters, { limit: lim, offset: off });
}

/**
 * @param {unknown} body
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createUserLog(body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createUserLogBodySchema, body);
    return userLogsRepository.createUserLog(
      {
        userId: parsed.userId ?? null,
        action: parsed.action,
        module:
          typeof parsed.module === "string"
            ? parsed.module.trim() || null
            : null,
        description: nullableString(parsed.description),
        method: nullableString(parsed.method),
        route: nullableString(parsed.route),
        statusCode: parsed.statusCode ?? null,
        ipAddress: nullableString(parsed.ipAddress),
        userAgent: nullableString(parsed.userAgent),
        deviceType: nullableString(parsed.deviceType),
        browser: nullableString(parsed.browser),
        os: nullableString(parsed.os),
        sessionId: nullableString(parsed.sessionId),
        metadata: parsed.metadata ?? null,
      },
      opts,
    );
  }, options);
}
