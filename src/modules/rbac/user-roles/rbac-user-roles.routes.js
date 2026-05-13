import { Router } from "express";

import {
  createUserRole,
  deleteUserRole,
  listUserRoles,
  setUserRoles,
} from "./rbac-user-roles.controller.js";

export const rbacUserRolesRoutes = Router();

rbacUserRolesRoutes.get("/users/:userId/roles", listUserRoles);
rbacUserRolesRoutes.put("/users/:userId/roles", setUserRoles);
rbacUserRolesRoutes.post("/users/:userId/roles", createUserRole);
rbacUserRolesRoutes.delete("/users/:userId/roles/:roleId", deleteUserRole);
