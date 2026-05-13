import { OAuth2Client } from "google-auth-library";

import { env } from "../../config/env-config.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../shared/services/jwt-service.js";
import * as rbacRolePermissionsService from "../rbac/role-permissions/rbac-role-permissions.service.js";
import * as rbacUserRoleService from "../rbac/user-roles/rbac-user-roles.service.js";
import { User } from "../users/users.model.js";
import * as usersService from "../users/users.service.js";

let oauthClient = null;

function getGoogleOAuthClient() {
  if (!oauthClient) {
    oauthClient = new OAuth2Client(env.googleClientId);
  }
  return oauthClient;
}

/**
 * Matches `routes-guard` DB principal: deduped role names and permission codes.
 * @param {number} userId
 * @returns {Promise<{ roles: string[]; permissions: string[] }>}
 */
async function rolesAndPermissionsForJwt(userId) {
  const userRoles =
    await rbacUserRoleService.getUserRolesWithDescriptions(userId);
  const roles = [...new Set(userRoles.map((r) => r.role.role_name))];
  const roleIds = [...new Set(userRoles.map((r) => r.role_id))];
  if (roleIds.length === 0) {
    return { roles, permissions: [] };
  }
  const links =
    await rbacRolePermissionsService.getRolePermissionsByRoleIds(roleIds);
  const permissions = [
    ...new Set(links.map((row) => row.permission.permission_code)),
  ];
  return { roles, permissions };
}

/**
 * @param {string} googleToken
 * @returns {Promise<{ accessToken: string; refreshToken: string; user: import("../users/users.model.js").User }>}
 */
export async function loginWithGoogleIdToken(googleToken) {
  const audience = env.googleClientId;
  const ticket = await getGoogleOAuthClient().verifyIdToken({
    idToken: googleToken,
    audience,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    const err = new Error("Invalid Google token");
    err.statusCode = 401;
    throw err;
  }

  const googleId = payload.sub;
  const email = payload.email.trim().toLowerCase();
  const fullName = payload.name ?? null;
  const pictureUrl = payload.picture ?? null;

  let user = await User.findOne({ where: { google_id: googleId } });
  if (!user) {
    user = await User.findOne({ where: { email } });
  }

  if (!user) {
    user = await usersService.createUser({
      email,
      google_id: googleId,
      full_name: fullName,
      picture_url: pictureUrl,
      is_active: true,
    });
  } else {
    await usersService.updateUser(user.id, {
      google_id: user.google_id ?? googleId,
      full_name: fullName ?? user.full_name,
      picture_url: pictureUrl ?? user.picture_url,
      last_login_at: new Date(),
    });
    const reloaded = await User.findByPk(user.id);
    if (!reloaded) {
      const err = new Error("User not found after update");
      err.statusCode = 500;
      throw err;
    }
    user = reloaded;
  }

  if (!user.is_active) {
    const err = new Error("Account disabled");
    err.statusCode = 403;
    throw err;
  }

  const { roles, permissions } = await rolesAndPermissionsForJwt(user.id);
  const accessToken = signAccessToken(user.id, roles, permissions);
  const refreshToken = signRefreshToken(user.id);

  return { accessToken, refreshToken, user };
}

/**
 * @param {string} refreshTokenFromCookie
 * @returns {Promise<string>} New access JWT
 */
export async function refreshAccessToken(refreshTokenFromCookie) {
  let userId;
  try {
    userId = verifyRefreshToken(refreshTokenFromCookie);
  } catch {
    const err = new Error("Invalid or expired refresh token");
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findByPk(userId);
  if (!user || !user.is_active) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  const { roles, permissions } = await rolesAndPermissionsForJwt(user.id);
  return signAccessToken(user.id, roles, permissions);
}

/**
 * @param {number} userId
 * @returns {Promise<{ user: import("../users/users.model.js").User; permissions: string[] }>}
 */
export async function getMe(userId) {
  const user = await usersService.getUserById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  if (!user.is_active) {
    const err = new Error("Account disabled");
    err.statusCode = 403;
    throw err;
  }
  return { user, permissions: [] };
}
