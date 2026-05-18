import { access, readdir } from "fs/promises";
import { constants as fsConstants } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Absolute path to `src/modules` (sibling of this file’s `bootstrap/` folder). */
export const MODULES_DIR = join(__dirname, "../modules");

/**
 * Lists subfolders of `modulesDir` that contain `registerFileName` (e.g. `models.register.js`).
 * Each entry is ready for `import(url.href)`.
 *
 * @param {string} modulesDir
 * @param {string} registerFileName
 * @returns {Promise<{ name: string, url: URL }[]>}
 */
export async function listModuleRegisterImports(modulesDir, registerFileName) {
  const entries = await readdir(modulesDir, { withFileTypes: true });
  const moduleNames = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  /** @type {{ name: string, url: URL }[]} */
  const out = [];

  for (const name of moduleNames) {
    const regPath = join(modulesDir, name, registerFileName);
    try {
      await access(regPath, fsConstants.F_OK);
    } catch {
      continue;
    }
    out.push({ name, url: pathToFileURL(regPath) });
  }

  return out;
}
