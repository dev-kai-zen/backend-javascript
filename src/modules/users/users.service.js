import { withTransaction } from "../../shared/db/with-transaction.js";
import { parseInput } from "../../shared/validation/parse-input.js";
import * as usersRepository from "./users.repository.js";
import {
  createUserBodySchema,
  updateUserBodySchema,
} from "./users.schemas.js";

/**
 * @param {unknown} body
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createUser(body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createUserBodySchema, body);
    return usersRepository.createUser(parsed, opts);
  }, options);
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
 * @param {unknown} body
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function updateUser(id, body, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(updateUserBodySchema, body);
    return usersRepository.updateUser(id, parsed, opts);
  }, options);
}

/**
 * @param {number} id
 * @param {import("../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function deleteUser(id, options = {}) {
  return withTransaction(
    (opts) => usersRepository.deleteUser(id, opts),
    options,
  );
}
