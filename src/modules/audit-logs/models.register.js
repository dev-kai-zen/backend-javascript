export const modelLoadDependencies = ["users"];

export async function registerModels() {
  await import("./audit-logs.model.js");
}
