import { Router } from "express";

import * as rbacUserRolesController from "./rbac-user-roles.controller.js";
import { RBAC_USER_ROLES } from "../rbac.permissions.js";
import  routesGuard  from "../../../shared/middlewares/routes-guard.js";

export const rbacUserRolesRoutes = Router();

rbacUserRolesRoutes.get(
  "/users/:userId/roles",
  routesGuard({ permissions: [RBAC_USER_ROLES.READ], source: "token" }),
  rbacUserRolesController.listUserRoles,
);
rbacUserRolesRoutes.put(
  "/users/:userId/roles",
  routesGuard({ permissions: [RBAC_USER_ROLES.WRITE], source: "token" }),
  rbacUserRolesController.setUserRoles,
);
rbacUserRolesRoutes.post(
  "/users/:userId/roles",
  routesGuard({ permissions: [RBAC_USER_ROLES.WRITE], source: "token" }),
  rbacUserRolesController.createUserRole,
);
rbacUserRolesRoutes.delete(
  "/users/:userId/roles/:roleId",
  routesGuard({ permissions: [RBAC_USER_ROLES.DELETE], source: "db" }),
  rbacUserRolesController.deleteUserRole,
);

