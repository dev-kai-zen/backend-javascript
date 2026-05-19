import { UniqueConstraintError } from "sequelize";

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
    return res.json({ data: categories });
  } catch (err) {
    console.error("listCategories:", err);
    return res.status(500).json({ message: "Failed to list categories" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createCategory(req, res) {
  try {
    const row = await rbacCategoriesService.createCategory(req.body);
    return res.status(201).json(row);
  } catch (err) {
    console.error("createCategory:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "categoryName already exists" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to create category" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getCategory(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const row = await rbacCategoriesService.getCategory(id);
    if (!row) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(row);
  } catch (err) {
    console.error("getCategory:", err);
    return res.status(500).json({ message: "Failed to get category" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateCategory(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const row = await rbacCategoriesService.updateCategory(id, req.body);
    if (!row) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(row);
  } catch (err) {
    console.error("updateCategory:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "categoryName already exists" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to update category" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteCategory(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const deleted = await rbacCategoriesService.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("deleteCategory:", err);
    return res.status(500).json({ message: "Failed to delete category" });
  }
}
