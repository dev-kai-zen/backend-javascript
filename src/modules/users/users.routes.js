import { Router } from "express";

import * as usersController from "./users.controller.js";
import { USERS } from "./users.permissions.js";
import  routesGuard  from "../../shared/middlewares/routes-guard.js";
/**
 * Mounted at `/api/v1/users` (see this module’s `routes.register.js`).
 */
export const usersRoutes = Router();

usersRoutes.post(
  "/",
  routesGuard({ permissions: [USERS.WRITE], source: "token" }),
  usersController.createUser,
);
usersRoutes.get(
  "/",
  routesGuard({ permissions: [USERS.READ], source: "token" }),
  usersController.getUsers,
);
usersRoutes.get(
  "/:id",
  routesGuard({ permissions: [USERS.READ], source: "token" }),
  usersController.getUserById,
);
usersRoutes.put(
  "/:id",
  routesGuard({ permissions: [USERS.UPDATE], source: "token" }),
  usersController.updateUser,
);
usersRoutes.delete(
  "/:id",
  routesGuard({ permissions: [USERS.DELETE], source: "db" }),
  usersController.deleteUser,
);
