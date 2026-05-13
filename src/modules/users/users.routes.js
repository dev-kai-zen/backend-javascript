import { Router } from "express";



import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./users.controller.js";

/**
 * Mounted at `/api/v1/users` (see `shared/routes/v1/modules-routes.js`).
 */
export const usersRoutes = Router();

usersRoutes.post("/", createUser);
usersRoutes.get("/", getUsers);
usersRoutes.get("/:id", getUserById);
usersRoutes.put("/:id", updateUser);
usersRoutes.delete("/:id", deleteUser);
