import { Router } from "express";

import * as rbacRolesController from "./rbac-roles.controller.js";

export const rbacRolesRoutes = Router();

rbacRolesRoutes.get("/", rbacRolesController.listRoles);
rbacRolesRoutes.post("/", rbacRolesController.createRole);
rbacRolesRoutes.get("/:id", rbacRolesController.getRole);
rbacRolesRoutes.patch("/:id", rbacRolesController.updateRole);
rbacRolesRoutes.delete("/:id", rbacRolesController.deleteRole);
