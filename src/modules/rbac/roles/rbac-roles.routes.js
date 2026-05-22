import { Router } from "express";

import * as rbacRolesController from "./rbac-roles.controller.js";
import { RBAC_ROLES } from "../rbac.permissions.js";
import routesGuard from "../../../shared/middlewares/routes-guard.js";

export const rbacRolesRoutes = Router();

rbacRolesRoutes.get(
  "/",
  routesGuard({ permissions: [RBAC_ROLES.READ], source: "token" }),
  rbacRolesController.listRoles,
);
rbacRolesRoutes.post(
  "/",
  routesGuard({ permissions: [RBAC_ROLES.WRITE], source: "token" }),
  rbacRolesController.createRole,
);
rbacRolesRoutes.get(
  "/:id",
  routesGuard({ permissions: [RBAC_ROLES.READ], source: "token" }),
  rbacRolesController.getRole,
);
rbacRolesRoutes.patch(
  "/:id",
  routesGuard({ permissions: [RBAC_ROLES.UPDATE], source: "token" }),
  rbacRolesController.updateRole,
);
rbacRolesRoutes.delete(
  "/:id",
  routesGuard({ permissions: [RBAC_ROLES.DELETE], source: "db" }),
  rbacRolesController.deleteRole,
);
