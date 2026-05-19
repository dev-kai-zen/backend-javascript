import * as usersRepository from "./users.repository.js";
import { sequelize } from "../../config/sequelize-config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/**
 * @param {{ email?: unknown; full_name?: unknown; google_id?: unknown; picture_url?: unknown; is_active?: unknown; last_login_at?: unknown }} body
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _createUser(body, options = {}) {
  if (!body || typeof body.email !== "string" || !body.email.trim()) {
    throw new Error("email is required");
  }
  const email = body.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    throw new Error("email must look like a valid address");
  }

  let last_login_at = null;
  if (body.last_login_at) {
    const d = new Date(body.last_login_at);
    if (Number.isNaN(d.getTime())) {
      throw new Error("last_login_at must be a valid date");
    }
    last_login_at = d;
  }

  const row = {
    email,
    full_name:
      typeof body.full_name === "string" && body.full_name.trim()
        ? body.full_name.trim()
        : null,
    google_id:
      typeof body.google_id === "string" && body.google_id.trim()
        ? body.google_id.trim()
        : null,
    picture_url:
      typeof body.picture_url === "string" && body.picture_url.trim()
        ? body.picture_url.trim()
        : null,
    is_active: body.is_active !== false,
    last_login_at,
  };

  return usersRepository.createUser(row, options);
}

/**
 * @param {{ email?: unknown; full_name?: unknown; google_id?: unknown; picture_url?: unknown; is_active?: unknown; last_login_at?: unknown }} body
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createUser(body, options = {}) {
  if (options.transaction) {
    return _createUser(body, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _createUser(body, { ...options, transaction });
  });
}

/**
 * @param {string | undefined} limit
 * @param {string | undefined} offset
 */
export async function getUsers(limit, offset) {
  return usersRepository.getUsers({ limit, offset });
}

/**
 * @param {number} id
 */
export async function getUserById(id) {
  return usersRepository.getUserById(id);
}


/**
 * @param {number} id
 * @param {{ full_name?: unknown; google_id?: unknown; picture_url?: unknown; is_active?: unknown; last_login_at?: unknown; email?: unknown }} body
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _updateUser(id, body, options = {}) {
  if (!body || typeof body !== "object") {
    throw new Error("request body is required");
  }

  /** @type {Record<string, unknown>} */
  const patch = {};

  if ("email" in body) {
    if (typeof body.email !== "string" || !body.email.trim()) {
      throw new Error("email cannot be empty");
    }
    const email = body.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      throw new Error("email must look like a valid address");
    }
    patch.email = email;
  }

  if ("full_name" in body) {
    patch.full_name =
      body.full_name === null || body.full_name === ""
        ? null
        : typeof body.full_name === "string"
          ? body.full_name.trim() || null
          : null;
  }

  if ("google_id" in body) {
    patch.google_id =
      body.google_id === null || body.google_id === ""
        ? null
        : typeof body.google_id === "string"
          ? body.google_id.trim() || null
          : null;
  }

  if ("picture_url" in body) {
    patch.picture_url =
      body.picture_url === null || body.picture_url === ""
        ? null
        : typeof body.picture_url === "string"
          ? body.picture_url.trim() || null
          : null;
  }

  if ("is_active" in body) {
    if (typeof body.is_active !== "boolean") {
      throw new Error("is_active must be true or false");
    }
    patch.is_active = body.is_active;
  }

  if ("last_login_at" in body) {
    if (body.last_login_at === null || body.last_login_at === "") {
      patch.last_login_at = null;
    } else {
      const d = new Date(body.last_login_at);
      if (Number.isNaN(d.getTime())) {
        throw new Error("last_login_at must be a valid date or null");
      }
      patch.last_login_at = d;
    }
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("no fields to update");
  }
  return usersRepository.updateUser(id, patch, options);
}

/**
 * @param {number} id
 * @param {{ full_name?: unknown; google_id?: unknown; picture_url?: unknown; is_active?: unknown; last_login_at?: unknown; email?: unknown }} body
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function updateUser(id, body, options = {}) {
  if (options.transaction) {
    return _updateUser(id, body, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _updateUser(id, body, { ...options, transaction });
  });
}


/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _deleteUser(id, options = {}) {
  return usersRepository.deleteUser(id, options);
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteUser(id, options = {}) {
  if (options.transaction) {
    return _deleteUser(id, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _deleteUser(id, { ...options, transaction });
  });
}
