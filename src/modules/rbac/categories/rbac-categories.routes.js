import { Router } from "express";

import * as rbacCategoriesController from "./rbac-categories.controller.js";

export const rbacCategoriesRoutes = Router();

rbacCategoriesRoutes.get("/", rbacCategoriesController.listCategories);
rbacCategoriesRoutes.post("/", rbacCategoriesController.createCategory);
rbacCategoriesRoutes.get("/:id", rbacCategoriesController.getCategory);
rbacCategoriesRoutes.patch("/:id", rbacCategoriesController.updateCategory);
rbacCategoriesRoutes.delete("/:id", rbacCategoriesController.deleteCategory);
