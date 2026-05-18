import { Router } from "express";

import * as rbacUserRolesController from "./rbac-user-roles.controller.js";

export const rbacUserRolesRoutes = Router();

rbacUserRolesRoutes.get("/users/:userId/roles", rbacUserRolesController.listUserRoles);
rbacUserRolesRoutes.put("/users/:userId/roles", rbacUserRolesController.setUserRoles);
rbacUserRolesRoutes.post("/users/:userId/roles", rbacUserRolesController.createUserRole);
rbacUserRolesRoutes.delete("/users/:userId/roles/:roleId", rbacUserRolesController.deleteUserRole);
