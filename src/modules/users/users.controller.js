import { UniqueConstraintError } from "sequelize";

import * as usersService from "./users.service.js";

function parseId(raw) {
  const id = Number.parseInt(String(raw), 10);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUser(req, res) {
  try {
    const user = await usersService.createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(409)
        .json({ message: "email or google_id is already taken" });
    }
    const message =
      err instanceof Error ? err.message : "failed to create user";
    return res.status(400).json({ message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUsers(req, res) {
  try {
    const users = await usersService.getUsers(req.query.limit, req.query.offset);
    return res.json({ data: users });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to list users";
    return res.status(400).json({ message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUserById(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "invalid id" });
  }
  try {
    const user = await usersService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to load user";
    return res.status(400).json({ message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateUser(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "invalid id" });
  }
  try {
    const user = await usersService.updateUser(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.json(user);
  } catch (err) {
    if (
      err instanceof UniqueConstraintError ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(409)
        .json({ message: "email or google_id is already taken" });
    }
    const message =
      err instanceof Error ? err.message : "failed to update user";
    return res.status(400).json({ message });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteUser(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "invalid id" });
  }
  try {
    const ok = await usersService.deleteUser(id);
    if (!ok) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(204).send();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "failed to delete user";
    return res.status(400).json({ message });
  }
}
