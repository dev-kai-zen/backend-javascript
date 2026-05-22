import { sendError, sendValidationError } from "../http/api-response.js";

/**
 * Wraps an async Express handler so failures become API error responses.
 * Re-thrown errors with `statusCode` are mapped via {@link sendError}; other errors
 * use `defaultMessage` / `defaultStatusCode` (and optional `logLabel`).
 *
 * @param {(req: import("express").Request, res: import("express").Response) => Promise<void>} handler
 * @param {{
 *   defaultMessage?: string;
 *   defaultStatusCode?: number;
 *   logLabel?: string;
 *   onError?: (req: import("express").Request, res: import("express").Response, err: unknown) => void;
 * }} [options]
 * @returns {(req: import("express").Request, res: import("express").Response) => Promise<import("express").Response | void>}
 */
export function asyncHandler(handler, options = {}) {
  const {
    defaultMessage = "Request failed",
    defaultStatusCode = 500,
    logLabel,
    onError,
  } = options;

  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      onError?.(req, res, err);

      if (err?.statusCode != null) {
        const message =
          err instanceof Error ? err.message : String(err?.message ?? defaultMessage);

        if (err.statusCode === 400) {
          return sendValidationError(res, {
            message,
            data: err.data ?? null,
          });
        }

        return sendError(res, {
          message,
          statusCode: err.statusCode,
        });
      }

      if (logLabel) {
        console.error(logLabel, err);
      }

      return sendError(res, {
        message: defaultMessage,
        statusCode: defaultStatusCode,
      });
    }
  };
}
