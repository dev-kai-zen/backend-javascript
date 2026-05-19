import { env } from "../../config/env-config.js";
import { sendError, sendSuccess, sendValidationError } from "../../shared/http/api-response.js";
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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function login(req, res) {
  try {
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
  } catch (err) {
    if (err?.statusCode != null) {
      return sendError(res, {
        message: err.message,
        statusCode: err.statusCode,
      });
    }
    console.error("google-auth login:", err);
    return sendError(res, { message: "Login failed", statusCode: 500 });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function refresh(req, res) {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME];
    if (typeof raw !== "string" || raw.trim() === "") {
      clearRefreshCookie(res);
      return sendError(res, {
        message: "Not authenticated",
        statusCode: 401,
      });
    }

    const accessToken =
      await googleAuthService.refreshAccessToken(raw);
    return sendSuccess(res, {
      message: "Token refreshed",
      data: { accessToken },
    });
  } catch (err) {
    clearRefreshCookie(res);
    if (err?.statusCode != null) {
      return sendError(res, {
        message: err.message,
        statusCode: err.statusCode,
      });
    }
    console.error("google-auth refresh:", err);
    return sendError(res, {
      message: "Not authenticated",
      statusCode: 401,
    });
  }
}

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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function me(req, res) {
  try {
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
  } catch (err) {
    if (err?.statusCode != null) {
      return sendError(res, {
        message: err.message,
        statusCode: err.statusCode,
      });
    }
    console.error("google-auth me:", err);
    return sendError(res, {
      message: "Failed to load profile",
      statusCode: 500,
    });
  }
}
