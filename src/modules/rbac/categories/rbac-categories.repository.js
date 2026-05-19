import { RbacCategory } from "./rbac-categories.model.js";

export async function listCategories() {
  return RbacCategory.findAll({ order: [["id", "ASC"]] });
}
/**
 * @param {{ categoryName: string }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function createCategory(data, options = {}) {
  return RbacCategory.create(
    { category_name: data.categoryName },
    options,
  );
}

/**
 * @param {number} id
 */
export async function getCategory(id) {
  return RbacCategory.findByPk(id);
}

/**
 * @param {number} id
 * @param {{ categoryName: string }} data
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function updateCategory(id, data, options = {}) {
  const row = await RbacCategory.findByPk(id, options);
  if (!row) {
    return null;
  }
  await row.update({ category_name: data.categoryName }, options);
  return row;
}

/**
 * @param {number} id
 * @param {{ transaction?: import("sequelize").Transaction }} [options]
 */
export async function deleteCategory(id, options = {}) {
  const deleted = await RbacCategory.destroy({ where: { id }, ...options });
  return deleted > 0;
}
