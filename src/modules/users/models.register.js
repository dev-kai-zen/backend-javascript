/** @type {string[]} Sibling folders under `src/modules` that must load first. */
export const modelLoadDependencies = [];

export async function registerModels() {
  await import("./users.model.js");
}
