import { RbacCategory } from "./rbac-categories.model.js";

export async function listCategories() {
  return RbacCategory.findAll({ order: [["id", "ASC"]] });
}

/**
 * @param {{ categoryName: string }} data
 */
export async function createCategory(data) {
  return RbacCategory.create({
    category_name: data.categoryName,
  });
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
 */
export async function updateCategory(id, data) {
  const row = await RbacCategory.findByPk(id);
  if (!row) {
    return null;
  }
  await row.update({ category_name: data.categoryName });
  return row;
}

/**
 * @param {number} id
 */
export async function deleteCategory(id) {
  const deleted = await RbacCategory.destroy({ where: { id } });
  return deleted > 0;
}
