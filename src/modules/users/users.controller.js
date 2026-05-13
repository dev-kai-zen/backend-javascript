import { UniqueConstraintError } from "sequelize";

import {
  createUser as createUserService,
  deleteUser as deleteUserService,
  getUserById as getUserByIdService,
  getUsers as getUsersService,
  updateUser as updateUserService,
} from "./users.service.js";

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
    const user = await createUserService(req.body);
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
    const users = await getUsersService(req.query.limit, req.query.offset);
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
    const user = await getUserByIdService(id);
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
    const user = await updateUserService(id, req.body);
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
    const ok = await deleteUserService(id);
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
