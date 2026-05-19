import { sequelize } from "../../config/sequelize-config.js";

/**
 * @typedef {{ transaction?: import("sequelize").Transaction }} DbOptions
 */

/**
 * Reuse `options.transaction` when present; otherwise open one transaction for this call.
 * Use in public service methods; keep business logic in a `_helper` passed as `fn`.
 *
 * @example
 * export async function createCategory(data, options = {}) {
 *   return withTransaction((opts) => _createCategory(data, opts), options);
 * }
 *
 * @template T
 * @param {(options: DbOptions) => Promise<T>} fn
 * @param {DbOptions} [options]
 * @returns {Promise<T>}
 */
export async function withTransaction(fn, options = {}) {
  if (options.transaction) {
    return fn(options);
  }

  return sequelize.transaction(async (transaction) => {
    return fn({ ...options, transaction });
  });
}
