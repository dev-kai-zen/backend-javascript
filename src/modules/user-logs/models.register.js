export const modelLoadDependencies = ["users"];

export async function registerModels() {
  await import("./user-logs.model.js");
}
