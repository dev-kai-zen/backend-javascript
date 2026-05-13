import { env } from "../../config/env-config.js";
import { buildUserPayload } from "./google-auth.payload.js";
import {
  getMe,
  loginWithGoogleIdToken,
  refreshAccessToken,
} from "./google-auth.service.js";

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
      return res.status(400).json({
        success: false,
        message: "Google Token is required",
      });
    }

    const { accessToken, refreshToken, user } =
      await loginWithGoogleIdToken(googleToken);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...refreshCookieBase(),
      maxAge: REFRESH_COOKIE_MAX_MS,
    });

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: buildUserPayload(user),
        permissions: [],
      },
    });
  } catch (err) {
    if (err?.statusCode != null) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    console.error("google-auth login:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
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
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const accessToken = await refreshAccessToken(raw);
    return res.json({
      success: true,
      message: "Token refreshed",
      data: { accessToken },
    });
  } catch (err) {
    clearRefreshCookie(res);
    if (err?.statusCode != null) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    console.error("google-auth refresh:", err);
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
}

/**
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 */
export async function logout(_req, res) {
  clearRefreshCookie(res);
  return res.json({
    success: true,
    message: "Logged out successfully",
    data: {},
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
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const fresh = await getMe(user.id);
    return res.json({
      success: true,
      message: "User details fetched",
      data: {
        user: buildUserPayload(fresh.user),
        permissions: fresh.permissions,
      },
    });
  } catch (err) {
    if (err?.statusCode != null) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    console.error("google-auth me:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load profile" });
  }
}
