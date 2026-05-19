/**
 * Central API response shape for all HTTP endpoints.
 *
 * @example Success
 * { "status": true, "message": "Success", "data": { ... } }
 *
 * @example Error
 * { "status": false, "message": "Request failed", "data": null }
 */

/**
 * @param {import("express").Response} res
 * @param {{ message?: string; data?: unknown; statusCode?: number }} [options]
 */
export function sendSuccess(res, options = {}) {
  const {
    message = "Success",
    data = null,
    statusCode = 200,
  } = options;

  return res.status(statusCode).json({
    status: true,
    message,
    data,
  });
}

/**
 * @param {import("express").Response} res
 * @param {{ message?: string; data?: unknown; statusCode?: number }} [options]
 */
export function sendError(res, options = {}) {
  const {
    message = "Request failed",
    data = null,
    statusCode = 500,
  } = options;

  return res.status(statusCode).json({
    status: false,
    message,
    data,
  });
}

/**
 * Client / validation errors (invalid body, bad id format, Zod, etc.).
 * @param {import("express").Response} res
 * @param {{ message?: string; data?: unknown }} [options]
 */
export function sendValidationError(res, options = {}) {
  const { message = "Validation failed", data = null } = options;

  return res.status(400).json({
    status: false,
    message,
    data,
  });
}
