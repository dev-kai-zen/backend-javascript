import * as rbacPermissionsService from "../../modules/rbac/permissions/rbac-permissions.service.js";
import * as rbacRolePermissionsService from "../../modules/rbac/role-permissions/rbac-role-permissions.service.js";
import * as rbacRolesService from "../../modules/rbac/roles/rbac-roles.service.js";
import * as rbacUserRolesService from "../../modules/rbac/user-roles/rbac-user-roles.service.js";

/**
 * @typedef {object} GuardOptions
 * @property {string[]} [roles]
 * @property {string[]} [permissions]
 * @property {"token"|"db"} [source] - `"db"` loads RBAC from DB; `"token"` uses JWT claims on `req`.
 */

/**
 * Returns Express middleware: use after `authenticateJwt` (sets `req.authUser`).
 * Enforces role names and/or permission codes from the JWT (`source: "token"`) or from DB (`source: "db"`).
 *
 * @param {GuardOptions} options
 * @returns {import("express").RequestHandler}
 */
export default function routesGuard(options) {
  const roleOpt = options.roles?.length ? options.roles : undefined;
  const permOpt = options.permissions?.length ? options.permissions : undefined;
  if (!roleOpt && !permOpt) {
    throw new Error(
      "routesGuard: either `roles` or `permissions` must be provided",
    );
  }
  const source = options.source ?? "token";

  return async function routesGuardMiddleware(req, res, next) {
    const authUser = req.authUser;
    if (!authUser) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      roleOpt &&
      !(await rbacRolesService.roleDefinitionsEligibleForGuard(roleOpt))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (
      permOpt &&
      !(await rbacPermissionsService.permissionDefinitionsEligibleForGuard(
        permOpt,
      ))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    /** @type {{ roles: string[]; permissions: string[] }} */
    let principal;
    if (source === "db") {
      const userRoles = await rbacUserRolesService.getUserRolesWithDescriptions(
        authUser.id,
      );
      const roles = userRoles.map((r) => r.role.role_name);
      const roleIds = [...new Set(userRoles.map((r) => r.role_id))];
      let permissions = [];
      if (roleIds.length > 0) {
        const links =
          await rbacRolePermissionsService.getRolePermissionsByRoleIds(
            roleIds,
          );
        permissions = [
          ...new Set(links.map((row) => row.permission.permission_code)),
        ];
      }
      principal = { roles, permissions };
    } else {
      principal = {
        roles: req.roles ?? [],
        permissions: req.permissions ?? [],
      };
    }

    if (roleOpt) {
      if (!roleOpt.some((role) => principal.roles.includes(role))) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    if (permOpt) {
      if (!permOpt.every((p) => principal.permissions.includes(p))) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    next();
  };
}
