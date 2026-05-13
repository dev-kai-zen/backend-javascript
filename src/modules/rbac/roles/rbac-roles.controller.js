import { UniqueConstraintError } from "sequelize";

import * as rolesService from "./rbac-roles.service.js";

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
function parseUpdateRoleBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body is required");
  }
  /** @type {{ roleName?: string; roleDescription?: string | null; isActive?: boolean }} */
  const patch = {};
  if ("roleName" in body) {
    if (typeof body.roleName !== "string") {
      throw new Error("roleName must be a string");
    }
    patch.roleName = body.roleName;
  }
  if ("roleDescription" in body) {
    if (
      body.roleDescription !== null &&
      typeof body.roleDescription !== "string"
    ) {
      throw new Error("roleDescription must be a string or null");
    }
    patch.roleDescription = body.roleDescription;
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
export async function listRoles(_req, res) {
  try {
    const roles = await rolesService.listRoles();
    return res.json({ data: roles });
  } catch (err) {
    console.error("listRoles:", err);
    return res.status(500).json({ message: "Failed to list roles" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createRole(req, res) {
  const body = req.body;
  if (!body || typeof body.roleName !== "string" || !body.roleName.trim()) {
    return res.status(400).json({ message: "roleName is required" });
  }
  let roleDescription = null;
  if ("roleDescription" in body && body.roleDescription !== undefined) {
    if (body.roleDescription !== null && typeof body.roleDescription !== "string") {
      return res
        .status(400)
        .json({ message: "roleDescription must be a string or null" });
    }
    roleDescription = body.roleDescription;
  }
  try {
    const role = await rolesService.createRole({
      roleName: body.roleName,
      roleDescription,
    });
    return res.status(201).json(role);
  } catch (err) {
    console.error("createRole:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "roleName already exists" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to create role" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRole(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const role = await rolesService.getRole(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.json(role);
  } catch (err) {
    console.error("getRole:", err);
    return res.status(500).json({ message: "Failed to get role" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateRole(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  let patch;
  try {
    patch = parseUpdateRoleBody(req.body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid body";
    return res.status(400).json({ message });
  }
  try {
    const role = await rolesService.updateRole(id, patch);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.json(role);
  } catch (err) {
    console.error("updateRole:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "roleName already exists" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to update role" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteRole(req, res) {
  const id = parsePathId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const deleted = await rolesService.deleteRole(id);
    if (!deleted) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("deleteRole:", err);
    return res.status(500).json({ message: "Failed to delete role" });
  }
}
