import {
  createUserLog as createUserLogRepo,
  listUserLogs as listUserLogsRepo,
} from "./user-logs.repository.js";

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

  return listUserLogsRepo(filters, { limit: lim, offset: off });
}

/**
 * @param {unknown} v
 * @returns {string | null}
 */
function asNullableString(v) {
  return typeof v === "string" ? v : null;
}

/**
 * @param {unknown} body
 */
export async function createUserLog(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body is required");
  }

  if (typeof body.action !== "string" || !body.action.trim()) {
    throw new Error("action is required");
  }
  const action = body.action.trim();
  if (action === "") {
    throw new Error("action is required");
  }

  let userId = null;
  if ("userId" in body && body.userId !== undefined) {
    if (body.userId === null) {
      userId = null;
    } else {
      const n = Number(body.userId);
      if (!Number.isFinite(n)) {
        throw new Error("userId must be a number or null");
      }
      userId = n;
    }
  }

  const moduleVal =
    typeof body.module === "string" ? body.module.trim() || null : null;

  let statusCode = null;
  if ("statusCode" in body && body.statusCode !== undefined) {
    if (body.statusCode === null) {
      statusCode = null;
    } else {
      const n = Number(body.statusCode);
      if (!Number.isFinite(n)) {
        throw new Error("statusCode must be a finite number or null");
      }
      statusCode = n;
    }
  }

  /** @type {Record<string, unknown> | null} */
  let metadata = null;
  if ("metadata" in body && body.metadata !== undefined) {
    if (body.metadata === null) {
      metadata = null;
    } else if (
      typeof body.metadata === "object" &&
      !Array.isArray(body.metadata)
    ) {
      metadata = /** @type {Record<string, unknown>} */ (body.metadata);
    } else {
      throw new Error("metadata must be a plain object or null");
    }
  }

  return createUserLogRepo({
    userId,
    action,
    module: moduleVal,
    description: asNullableString(body.description),
    method: asNullableString(body.method),
    route: asNullableString(body.route),
    statusCode,
    ipAddress: asNullableString(body.ipAddress),
    userAgent: asNullableString(body.userAgent),
    deviceType: asNullableString(body.deviceType),
    browser: asNullableString(body.browser),
    os: asNullableString(body.os),
    sessionId: asNullableString(body.sessionId),
    metadata,
  });
}
