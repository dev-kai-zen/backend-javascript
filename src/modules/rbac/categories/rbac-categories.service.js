import { withTransaction } from "../../../shared/db/with-transaction.js";
import { parseInput } from "../../../shared/validation/parse-input.js";
import * as rbacCategoriesRepository from "./rbac-categories.repository.js";
import {
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from "./rbac-categories.schemas.js";

export async function listCategories() {
  return rbacCategoriesRepository.listCategories();
}

/**
 * @param {unknown} data
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function createCategory(data, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(createCategoryBodySchema, data);
    return rbacCategoriesRepository.createCategory(
      { categoryName: parsed.categoryName },
      opts,
    );
  }, options);
}

/**
 * @param {number} id
 */
export async function getCategory(id) {
  return rbacCategoriesRepository.getCategory(id);
}

/**
 * @param {number} id
 * @param {unknown} data
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function updateCategory(id, data, options = {}) {
  return withTransaction(async (opts) => {
    const parsed = parseInput(updateCategoryBodySchema, data);
    return rbacCategoriesRepository.updateCategory(
      id,
      { categoryName: parsed.categoryName },
      opts,
    );
  }, options);
}

/**
 * @param {number} id
 * @param {import("../../../shared/db/with-transaction.js").DbOptions} [options]
 */
export async function deleteCategory(id, options = {}) {
  return withTransaction(
    (opts) => rbacCategoriesRepository.deleteCategory(id, opts),
    options,
  );
}
