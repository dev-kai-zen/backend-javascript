import { Router } from "express";

import * as rbacCategoriesController from "./rbac-categories.controller.js";
import { RBAC_CATEGORIES } from "../rbac.permissions.js";
import routesGuard from "../../../shared/middlewares/routes-guard.js";

export const rbacCategoriesRoutes = Router();

rbacCategoriesRoutes.get(
  "/",
  routesGuard({ permissions: [RBAC_CATEGORIES.READ], source: "token" }),
  rbacCategoriesController.listCategories,
);
rbacCategoriesRoutes.post(
  "/",
  routesGuard({ permissions: [RBAC_CATEGORIES.WRITE], source: "token" }),
  rbacCategoriesController.createCategory,
);
rbacCategoriesRoutes.get(
  "/:id",
  routesGuard({ permissions: [RBAC_CATEGORIES.READ], source: "token" }),
  rbacCategoriesController.getCategory,
);
rbacCategoriesRoutes.patch(
  "/:id",
  routesGuard({ permissions: [RBAC_CATEGORIES.UPDATE], source: "token" }),
  rbacCategoriesController.updateCategory,
);
rbacCategoriesRoutes.delete(
  "/:id",
  routesGuard({ permissions: [RBAC_CATEGORIES.DELETE], source: "db" }),
  rbacCategoriesController.deleteCategory,
);
