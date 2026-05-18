import { Router } from "express";

import * as rbacPermissionsController from "./rbac-permissions.controller.js";

export const rbacPermissionsRoutes = Router();

rbacPermissionsRoutes.get("/", rbacPermissionsController.listPermissions);
rbacPermissionsRoutes.post("/", rbacPermissionsController.createPermission);
rbacPermissionsRoutes.get("/:id", rbacPermissionsController.getPermission);
rbacPermissionsRoutes.patch("/:id", rbacPermissionsController.updatePermission);
rbacPermissionsRoutes.delete("/:id", rbacPermissionsController.deletePermission);
