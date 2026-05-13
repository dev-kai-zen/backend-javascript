import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "./rbac-categories.controller.js";

export const rbacCategoriesRoutes = Router();

rbacCategoriesRoutes.get("/", listCategories);
rbacCategoriesRoutes.post("/", createCategory);
rbacCategoriesRoutes.get("/:id", getCategory);
rbacCategoriesRoutes.patch("/:id", updateCategory);
rbacCategoriesRoutes.delete("/:id", deleteCategory);
