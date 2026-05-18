import { Router } from "express";



import * as usersController from "./users.controller.js";

/**
 * Mounted at `/api/v1/users` (see this module’s `routes.register.js`).
 */
export const usersRoutes = Router();

usersRoutes.post("/", usersController.createUser);
usersRoutes.get("/", usersController.getUsers);
usersRoutes.get("/:id", usersController.getUserById);
usersRoutes.put("/:id", usersController.updateUser);
usersRoutes.delete("/:id", usersController.deleteUser);
