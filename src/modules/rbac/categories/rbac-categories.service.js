import * as rbacCategoriesRepository from "./rbac-categories.repository.js";
import { sequelize } from "../../../config/sequelize-config.js";

export async function listCategories() {
  return rbacCategoriesRepository.listCategories();
}

/**
 * @param {{ categoryName: string }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _createCategory(data, options = {}) {
  if (!data.categoryName || data.categoryName.trim() === "") {
    throw new Error("categoryName is required");
  }

  return rbacCategoriesRepository.createCategory(
    { categoryName: data.categoryName.trim() },
    options,
  );
}

/**
 * @param {{ categoryName: string }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createCategory(data, options = {}) {

  if (options.transaction) {
    return _createCategory(data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _createCategory(data, { ...options, transaction });
  });
}

/**
 * @param {number} id
 */
export async function getCategory(id) {
  return rbacCategoriesRepository.getCategory(id);
}

/**
 * @param {number} id
 * @param {{ categoryName: string }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _updateCategory(id, data, options = {}) {

  if (!data.categoryName || data.categoryName.trim() === "") {
    throw new Error("categoryName is required");
  }
  
  return rbacCategoriesRepository.updateCategory(
    id,
    { categoryName: data.categoryName.trim() },
    options,
  );
}

/**
 * @param {number} id
 * @param {{ categoryName: string }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function updateCategory(id, data, options = {}) {

  if (options.transaction) {
    return _updateCategory(id, data, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _updateCategory(id, data, { ...options, transaction });
  });
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
async function _deleteCategory(id, options = {}) {
  return rbacCategoriesRepository.deleteCategory(id, options);
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteCategory(id, options = {}) {
  if (options.transaction) {
    return _deleteCategory(id, options);
  }

  return sequelize.transaction(async (transaction) => {
    return _deleteCategory(id, { ...options, transaction });
  });
}
