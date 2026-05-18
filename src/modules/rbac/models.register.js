export const modelLoadDependencies = [];

export async function registerModels() {
  await import("./rbac.models.js");
}
