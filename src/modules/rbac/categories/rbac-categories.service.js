import * as rbacCategoriesRepository from "./rbac-categories.repository.js";

export async function listCategories() {
  return rbacCategoriesRepository.listCategories();
}

/**
 * @param {{ categoryName: string }} data
 */
export async function createCategory(data) {
  if (!data.categoryName || data.categoryName.trim() === "") {
    throw new Error("categoryName is required");
  }
  return rbacCategoriesRepository.createCategory({
    categoryName: data.categoryName.trim(),
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
 */
export async function updateCategory(id, data) {
  if (!data.categoryName || data.categoryName.trim() === "") {
    throw new Error("categoryName is required");
  }
  return rbacCategoriesRepository.updateCategory(id, {
    categoryName: data.categoryName.trim(),
  });
}

/**
 * @param {number} id
 */
export async function deleteCategory(id) {
  return rbacCategoriesRepository.deleteCategory(id);
}
