import { Router } from "express";

import {
  listModuleRegisterImports,
  MODULES_DIR,
} from "./discover-module-registers.js";

/**
 * Builds the `/api/v1` router from each `src/modules/<name>/routes.register.js`.
 *
 * New HTTP surface: add that file in your module only. Export:
 * - `registerV1Routes(v1Router)` — mount your feature Router(s) on `v1Router`
 *
 * Registrars run in ascending order by module folder name.
 */
export async function buildV1ModulesRouter() {
  const registrars = await listModuleRegisterImports(
    MODULES_DIR,
    "routes.register.js",
  );

  /** @type {{ name: string, register: (r: import("express").Router) => void }[]} */
  const discovered = [];

  for (const { name, url } of registrars) {
    const mod = await import(url.href);
    const register = mod.registerV1Routes;

    if (typeof register !== "function") {
      throw new Error(
        `Module "${name}": routes.register.js must export function registerV1Routes(v1Router)`,
      );
    }

    discovered.push({ name, register });
  }

  discovered.sort((a, b) => a.name.localeCompare(b.name));

  const v1Router = Router();

  for (const { register } of discovered) {
    register(v1Router);
  }

  return v1Router;
}
