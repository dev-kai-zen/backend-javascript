import { UniqueConstraintError } from "sequelize";

import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import * as rbacCategoriesService from "./rbac-categories.service.js";

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
export async function listCategories(_req, res) {
  try {
    const categories = await rbacCategoriesService.listCategories();
    return sendSuccess(res, {
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (err) {
    console.error("listCategories:", err);
    return sendError(res, {
      message: "Failed to list categories",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createCategory(req, res) {
  try {
    const row = await rbacCategoriesService.createCategory(req.body);
    return sendSuccess(res, {
      message: "Category created successfully",
      statusCode: 201,
      data: row,
    });
  } catch (err) {
    console.error("createCategory:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "categoryName already exists",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to create category",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getCategory(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const row = await rbacCategoriesService.getCategory(id);
    if (!row) {
      return sendError(res, { message: "Category not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Category fetched successfully",
      data: row,
    });
  } catch (err) {
    console.error("getCategory:", err);
    return sendError(res, { message: "Failed to get category", statusCode: 500 });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateCategory(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const row = await rbacCategoriesService.updateCategory(id, req.body);
    if (!row) {
      return sendError(res, { message: "Category not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Category updated successfully",
      data: row,
    });
  } catch (err) {
    console.error("updateCategory:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return sendError(res, {
        message: "categoryName already exists",
        statusCode: 409,
      });
    }
    if (err instanceof Error) {
      return sendValidationError(res, { message: err.message });
    }
    return sendError(res, {
      message: "Failed to update category",
      statusCode: 500,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteCategory(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return sendValidationError(res, { message: "Invalid id" });
  }
  try {
    const deleted = await rbacCategoriesService.deleteCategory(id);
    if (!deleted) {
      return sendError(res, { message: "Category not found", statusCode: 404 });
    }
    return sendSuccess(res, {
      message: "Category deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("deleteCategory:", err);
    return sendError(res, {
      message: "Failed to delete category",
      statusCode: 500,
    });
  }
}
