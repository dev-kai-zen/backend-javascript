export const modelLoadDependencies = ["users"];

export async function registerModels() {
  await import("./refresh-token.model.js");
}
