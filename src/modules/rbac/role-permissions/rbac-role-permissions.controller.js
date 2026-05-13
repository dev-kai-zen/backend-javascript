import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from "sequelize";

import * as rbacRolePermissionsService from "./rbac-role-permissions.service.js";

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
export async function listRolePermissions(req, res) {
  const roleId = parsePathId(req.params.id);
  if (roleId === null) {
    return res.status(400).json({ message: "Invalid role id" });
  }
  try {
    const rows = await rbacRolePermissionsService.listRolePermissions(roleId);
    return res.json({ data: rows });
  } catch (err) {
    console.error("listRolePermissions:", err);
    return res.status(500).json({ message: "Failed to list role permissions" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function setRolePermissions(req, res) {
  const roleId = parsePathId(req.params.id);
  if (roleId === null) {
    return res.status(400).json({ message: "Invalid role id" });
  }
  const body = req.body;
  if (!body || !Array.isArray(body.permissionIds)) {
    return res.status(400).json({ message: "permissionIds array is required" });
  }
  const permissionIds = [];
  for (const p of body.permissionIds) {
    const n = Number(p);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({
        message: "each permission id must be a positive integer",
      });
    }
    permissionIds.push(n);
  }
  try {
    const rows = await rbacRolePermissionsService.setRolePermissions(
      roleId,
      permissionIds,
    );
    if (!rows) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.json({ data: rows });
  } catch (err) {
    console.error("setRolePermissions:", err);
    if (
      err instanceof ForeignKeyConstraintError ||
      err.name === "SequelizeForeignKeyConstraintError"
    ) {
      return res.status(400).json({
        message: "One or more permission ids do not exist",
      });
    }
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({ message: "Duplicate permission id in request" });
    }
    return res.status(500).json({ message: "Failed to set role permissions" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createRolePermission(req, res) {
  const roleId = parsePathId(req.params.id);
  if (roleId === null) {
    return res.status(400).json({ message: "Invalid role id" });
  }
  const body = req.body;
  const permissionId = Number(body?.permissionId);
  if (!Number.isInteger(permissionId) || permissionId < 1) {
    return res.status(400).json({
      message: "permissionId must be a positive integer",
    });
  }
  try {
    const row = await rbacRolePermissionsService.createRolePermission({
      roleId,
      permissionId,
    });
    return res.status(201).json(row);
  } catch (err) {
    console.error("createRolePermission:", err);
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(409)
        .json({ message: "This permission is already assigned to the role" });
    }
    return res.status(500).json({ message: "Failed to assign permission to role" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteRolePermission(req, res) {
  const roleId = parsePathId(req.params.id);
  const permissionId = parsePathId(req.params.permissionId);
  if (roleId === null || permissionId === null) {
    return res.status(400).json({ message: "Invalid role id or permissionId" });
  }
  try {
    const deleted = await rbacRolePermissionsService.deleteRolePermission(
      roleId,
      permissionId,
    );
    if (!deleted) {
      return res.status(404).json({ message: "Role permission link not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("deleteRolePermission:", err);
    return res.status(500).json({ message: "Failed to remove role permission" });
  }
}
