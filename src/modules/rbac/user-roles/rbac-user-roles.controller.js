import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from "sequelize";

import * as rbacUserRolesService from "./rbac-user-roles.service.js";

/**
 * @param {unknown} raw
 */
function parsePathInt(raw) {
  const id = typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(id) ? id : null;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function listUserRoles(req, res) {
  const userId = parsePathInt(req.params.userId);
  if (userId === null) {
    return res.status(400).json({ message: "Invalid userId" });
  }
  try {
    const rows = await rbacUserRolesService.listUserRoles(userId);
    return res.json({ data: rows });
  } catch (err) {
    console.error("listUserRoles:", err);
    return res.status(500).json({ message: "Failed to list user roles" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function setUserRoles(req, res) {
  const userId = parsePathInt(req.params.userId);
  if (userId === null) {
    return res.status(400).json({ message: "Invalid userId" });
  }
  try {
    const rows = await rbacUserRolesService.setUserRoles(userId, req.body);
    if (!rows) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ data: rows });
  } catch (err) {
    console.error("setUserRoles:", err);
    if (
      err instanceof ForeignKeyConstraintError ||
      err.name === "SequelizeForeignKeyConstraintError"
    ) {
      return res.status(400).json({ message: "One or more role ids do not exist" });
    }
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "Duplicate role id in request" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to set user roles" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUserRole(req, res) {
  const userId = parsePathInt(req.params.userId);
  if (userId === null) {
    return res.status(400).json({ message: "Invalid userId" });
  }
  try {
    const row = await rbacUserRolesService.createUserRole(userId, req.body);
    return res.status(201).json(row);
  } catch (err) {
    console.error("createUserRole:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(409)
        .json({ message: "This role is already assigned to the user" });
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to assign role to user" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteUserRole(req, res) {
  const userId = parsePathInt(req.params.userId);
  const roleId = parsePathInt(req.params.roleId);
  if (userId === null || roleId === null) {
    return res.status(400).json({ message: "Invalid userId or roleId" });
  }
  try {
    const deleted = await rbacUserRolesService.deleteUserRole(userId, roleId);
    if (!deleted) {
      return res.status(404).json({ message: "User role link not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("deleteUserRole:", err);
    return res.status(500).json({ message: "Failed to remove user role" });
  }
}
