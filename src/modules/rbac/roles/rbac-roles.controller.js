import { UniqueConstraintError } from "sequelize";

import * as rbacRolesService from "./rbac-roles.service.js";

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
export async function listRoles(_req, res) {
  try {
    const roles = await rbacRolesService.listRoles();
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
  try {
    const role = await rbacRolesService.createRole(req.body);
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
    const role = await rbacRolesService.getRole(id);
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
  try {
    const role = await rbacRolesService.updateRole(id, req.body);
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
    const deleted = await rbacRolesService.deleteRole(id);
    if (!deleted) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("deleteRole:", err);
    return res.status(500).json({ message: "Failed to delete role" });
  }
}
