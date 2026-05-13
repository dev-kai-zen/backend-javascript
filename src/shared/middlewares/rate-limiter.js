import rateLimit from "express-rate-limit";

/** 15 minutes — same window for both limiters so ops can reason about one timeline. */
const WINDOW_MS = 15 * 60 * 1000;

/**
 * Applied to all `/api/v1/*` traffic. Uses in-memory store per process (fine for single instance).
 *
 * Behind a reverse proxy, set `app.set("trust proxy", 1)` in `createApp` so `req.ip` is correct.
 *
 * @type {import("express-rate-limit").RateLimitRequestHandler}
 */
export const apiRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many API requests from this address. Please try again later.",
  },
});

/**
 * Stricter cap for credential / token endpoints (`login`, `refresh`). Stacks on top of {@link apiRateLimiter}.
 *
 * @type {import("express-rate-limit").RateLimitRequestHandler}
 */
export const authRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts from this address. Please wait before trying again.",
  },
});
