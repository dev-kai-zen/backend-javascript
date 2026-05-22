import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacCategoriesService from "./rbac-categories.service.js";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";

/**
 * @param {unknown} raw
 */
function parsePathId(raw) {
  const id = typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(id) ? id : null;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const listCategories = asyncHandler(
  async (_req, res) => {
    const categories = await rbacCategoriesService.listCategories();
    return sendSuccess(res, {
      message: "Categories fetched successfully",
      data: categories,
    });
  },
  {
    defaultMessage: "Failed to list categories",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createCategory = asyncHandler(
  async (req, res) => {
    const row = await rbacCategoriesService.createCategory(req.body);
    return sendSuccess(res, {
      message: "Category created successfully",
      statusCode: 201,
      data: row,
    });
  },
  {
    defaultMessage: "Failed to create category",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getCategory = asyncHandler(
  async (req, res) => {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return sendValidationError(res, { message: "Invalid id" });
    }
    const row = await rbacCategoriesService.getCategory(id);
    if (!row) {
      return sendError(res, { message: "Category not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Category fetched successfully",
      data: row,
    });
  },
  {
    defaultMessage: "Failed to get category",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateCategory = asyncHandler(
  async (req, res) => {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return sendValidationError(res, { message: "Invalid id" });
    }
    const row = await rbacCategoriesService.updateCategory(id, req.body);
    if (!row) {
      return sendError(res, { message: "Category not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Category updated successfully",
      data: row,
    });
  },
  {
    defaultMessage: "Failed to update category",
    defaultStatusCode: 500,
  },
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteCategory = asyncHandler(
  async (req, res) => {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return sendValidationError(res, { message: "Invalid id" });
    }
    const deleted = await rbacCategoriesService.deleteCategory(id);
    if (!deleted) {
      return sendError(res, { message: "Category not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Category deleted successfully",
      data: null,
    });
  },
  {
    defaultMessage: "Failed to delete category",
    defaultStatusCode: 500,
  },
);
