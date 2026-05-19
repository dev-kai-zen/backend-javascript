import { UniqueConstraintError } from "sequelize";

import * as rbacPermissionsService from "./rbac-permissions.service.js";

/**
 * @param {unknown} val
 */
function firstQueryString(val) {
  if (typeof val === "string") {
    return val;
  }
  if (Array.isArray(val) && typeof val[0] === "string") {
    return val[0];
  }
  return undefined;
}

/**
 * Parse list query categoryId like TS zod transform
 * @param {string | undefined} categoryIdRaw
 */
function parseListCategoryId(categoryIdRaw) {
  if (typeof categoryIdRaw !== "string" || categoryIdRaw.trim() === "") {
    return {};
  }
  const n = Number.parseInt(categoryIdRaw.trim(), 10);
  return { categoryId: Number.isFinite(n) ? n : undefined };
}

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
export async function listPermissions(req, res) {
  const { categoryId } = parseListCategoryId(
    firstQueryString(req.query.categoryId),
  );
  /** @type {{ categoryId?: number }} */
  const filters = {};
  if (categoryId !== undefined) {
    filters.categoryId = categoryId;
  }
  try {
    const rows = await rbacPermissionsService.listPermissions(filters);
    return res.json({ data: rows });
  } catch (err) {
    console.error("listPermissions:", err);
    return res.status(500).json({ message: "Failed to list permissions" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createPermission(req, res) {
  try {
    const row = await rbacPermissionsService.createPermission(req.body);
    return res.status(201).json(row);
  } catch (err) {
    console.error("createPermission:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "permissionCode already exists" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to create permission" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getPermission(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const row = await rbacPermissionsService.getPermission(id);
    if (!row) {
      return res.status(404).json({ message: "Permission not found" });
    }
    return res.json(row);
  } catch (err) {
    console.error("getPermission:", err);
    return res.status(500).json({ message: "Failed to get permission" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updatePermission(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const row = await rbacPermissionsService.updatePermission(id, req.body);
    if (!row) {
      return res.status(404).json({ message: "Permission not found" });
    }
    return res.json(row);
  } catch (err) {
    console.error("updatePermission:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "permissionCode already exists" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to update permission" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deletePermission(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const deleted = await rbacPermissionsService.deletePermission(id);
    if (!deleted) {
      return res.status(404).json({ message: "Permission not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("deletePermission:", err);
    return res.status(500).json({ message: "Failed to delete permission" });
  }
}
