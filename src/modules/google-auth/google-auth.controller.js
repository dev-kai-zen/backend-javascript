import { env } from "../../config/env-config.js";
import { sendError, sendSuccess, sendValidationError } from "../../shared/http/api-response.js";
import { asyncHandler } from "../../shared/middlewares/async-handler.js";
import { buildUserPayload } from "./google-auth.payload.js";
import * as googleAuthService from "./google-auth.service.js";

/** Cookie name for the long-lived refresh JWT (httpOnly, not readable from JS). */
const REFRESH_COOKIE_NAME = "refresh_token";

const REFRESH_COOKIE_MAX_MS = 7 * 24 * 60 * 60 * 1000;

function refreshCookieBase() {
  return {
    httpOnly: true,
    secure: !env.isDevelopment,
    sameSite: "lax",
    path: "/",
  };
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieBase());
}

export const login = asyncHandler(
  async (req, res) => {
    const googleToken = req.body?.googleToken;
    if (typeof googleToken !== "string" || googleToken.trim() === "") {
      return sendValidationError(res, { message: "Google Token is required" });
    }

    const { accessToken, refreshToken, user } =
      await googleAuthService.loginWithGoogleIdToken(googleToken);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...refreshCookieBase(),
      maxAge: REFRESH_COOKIE_MAX_MS,
    });

    return sendSuccess(res, {
      message: "Login successful",
      data: {
        accessToken,
        user: buildUserPayload(user),
        permissions: [],
      },
    });
  },
  { defaultMessage: "Login failed", logLabel: "google-auth login:" },
);

export const refresh = asyncHandler(
  async (req, res) => {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME];
    if (typeof raw !== "string" || raw.trim() === "") {
      clearRefreshCookie(res);
      return sendError(res, {
        message: "Not authenticated",
        statusCode: 401,
      });
    }

    const accessToken = await googleAuthService.refreshAccessToken(raw);
    return sendSuccess(res, {
      message: "Token refreshed",
      data: { accessToken },
    });
  },
  {
    defaultMessage: "Not authenticated",
    defaultStatusCode: 401,
    logLabel: "google-auth refresh:",
    onError: (_req, res) => clearRefreshCookie(res),
  },
);

/**
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 */
export async function logout(_req, res) {
  clearRefreshCookie(res);
  return sendSuccess(res, {
    message: "Logged out successfully",
    data: null,
  });
}

export const me = asyncHandler(
  async (req, res) => {
    const user = req.authUser;
    if (!user?.id) {
      return sendError(res, { message: "Unauthorized", statusCode: 401 });
    }
    const fresh = await googleAuthService.getMe(user.id);
    return sendSuccess(res, {
      message: "User details fetched",
      data: {
        user: buildUserPayload(fresh.user),
        permissions: fresh.permissions,
      },
    });
  },
  { defaultMessage: "Failed to load profile", logLabel: "google-auth me:" },
);
