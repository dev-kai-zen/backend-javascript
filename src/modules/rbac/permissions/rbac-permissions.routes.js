import { Router } from "express";

import * as rbacPermissionsController from "./rbac-permissions.controller.js";
import { RBAC_PERMISSIONS } from "../rbac.permissions.js";
import routesGuard from "../../../shared/middlewares/routes-guard.js";

export const rbacPermissionsRoutes = Router();

rbacPermissionsRoutes.get(
  "/",
  routesGuard({ permissions: [RBAC_PERMISSIONS.READ], source: "token" }),
  rbacPermissionsController.listPermissions,
);
rbacPermissionsRoutes.post(
  "/",
  routesGuard({ permissions: [RBAC_PERMISSIONS.WRITE], source: "token" }),
  rbacPermissionsController.createPermission,
);
rbacPermissionsRoutes.get(
  "/:id",
  routesGuard({ permissions: [RBAC_PERMISSIONS.READ], source: "token" }),
  rbacPermissionsController.getPermission,
);
rbacPermissionsRoutes.patch(
  "/:id",
  routesGuard({ permissions: [RBAC_PERMISSIONS.UPDATE], source: "token" }),
  rbacPermissionsController.updatePermission,
);
rbacPermissionsRoutes.delete(
  "/:id",
  routesGuard({ permissions: [RBAC_PERMISSIONS.DELETE], source: "db" }),
  rbacPermissionsController.deletePermission,
);
