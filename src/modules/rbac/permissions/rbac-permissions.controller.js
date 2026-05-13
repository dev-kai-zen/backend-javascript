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
 * @param {unknown} body
 */
function parseCreatePermissionBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body is required");
  }
  if (typeof body.permissionCode !== "string" || !body.permissionCode.trim()) {
    throw new Error("permissionCode is required");
  }
  let permissionDescription = null;
  if (
    "permissionDescription" in body &&
    body.permissionDescription !== undefined
  ) {
    if (body.permissionDescription !== null) {
      if (typeof body.permissionDescription !== "string") {
        throw new Error("permissionDescription must be a string or null");
      }
      permissionDescription = body.permissionDescription;
    }
  }
  let categoryId = null;
  if ("categoryId" in body && body.categoryId !== undefined) {
    if (body.categoryId === null) {
      categoryId = null;
    } else {
      const n = Number(body.categoryId);
      if (!Number.isInteger(n) || n < 0) {
        throw new Error("categoryId must be a non-negative integer or null");
      }
      categoryId = n;
    }
  }
  return {
    permissionCode: body.permissionCode,
    permissionDescription,
    categoryId,
  };
}

/**
 * @param {unknown} body
 */
function parseUpdatePermissionBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body is required");
  }
  /** @type {{ permissionCode?: string; permissionDescription?: string | null; categoryId?: number | null; isActive?: boolean }} */
  const patch = {};
  if ("permissionCode" in body) {
    if (typeof body.permissionCode !== "string") {
      throw new Error("permissionCode must be a string");
    }
    patch.permissionCode = body.permissionCode;
  }
  if ("permissionDescription" in body) {
    if (
      body.permissionDescription !== null &&
      typeof body.permissionDescription !== "string"
    ) {
      throw new Error("permissionDescription must be a string or null");
    }
    patch.permissionDescription = body.permissionDescription;
  }
  if ("categoryId" in body) {
    if (body.categoryId === null) {
      patch.categoryId = null;
    } else {
      const n = Number(body.categoryId);
      if (!Number.isInteger(n) || n < 0) {
        throw new Error("categoryId must be a non-negative integer or null");
      }
      patch.categoryId = n;
    }
  }
  if ("isActive" in body) {
    if (typeof body.isActive !== "boolean") {
      throw new Error("isActive must be a boolean");
    }
    patch.isActive = body.isActive;
  }
  if (Object.keys(patch).length === 0) {
    throw new Error("No fields to update");
  }
  return patch;
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
  let payload;
  try {
    payload = parseCreatePermissionBody(req.body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid body";
    return res.status(400).json({ message });
  }
  try {
    const row = await rbacPermissionsService.createPermission(payload);
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
  let patch;
  try {
    patch = parseUpdatePermissionBody(req.body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid body";
    return res.status(400).json({ message });
  }
  try {
    const row = await rbacPermissionsService.updatePermission(id, patch);
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
