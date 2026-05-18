import {
  listModuleRegisterImports,
  MODULES_DIR,
} from "./discover-module-registers.js";

/**
 * Loads Sequelize models from each `src/modules/<name>/models.register.js`.
 *
 * New domain: add that file in your module only. Export `modelLoadDependencies`
 * with sibling folder names that must run first (e.g. `['users']`), and
 * `registerModels()` that dynamic-imports your `*.model.js` files in order.
 */
export async function registerModuleModels() {
  const registrars = await listModuleRegisterImports(
    MODULES_DIR,
    "models.register.js",
  );

  /** @type {Map<string, { deps: string[], registerModels: () => Promise<void> }>} */
  const discovered = new Map();

  for (const { name, url } of registrars) {
    const mod = await import(url.href);
    const deps = Array.isArray(mod.modelLoadDependencies)
      ? mod.modelLoadDependencies
      : [];
    const registerModels = mod.registerModels;

    if (typeof registerModels !== "function") {
      throw new Error(
        `Module "${name}": models.register.js must export function registerModels()`,
      );
    }

    discovered.set(name, { deps, registerModels });
  }

  const order = topologicalSortModules(discovered);

  for (const name of order) {
    await discovered.get(name).registerModels();
  }
}

/**
 * @param {Map<string, { deps: string[] }>} discovered
 * @returns {string[]}
 */
function topologicalSortModules(discovered) {
  const names = [...discovered.keys()];
  const indegree = new Map(names.map((n) => [n, 0]));
  /** @type {Map<string, string[]>} */
  const adj = new Map(names.map((n) => [n, []]));

  for (const name of names) {
    const { deps } = discovered.get(name);
    for (const d of deps) {
      if (!discovered.has(d)) {
        throw new Error(
          `Module "${name}": modelLoadDependencies references "${d}" but that module has no models.register.js`,
        );
      }
      indegree.set(name, indegree.get(name) + 1);
      adj.get(d).push(name);
    }
  }

  const queue = names.filter((n) => indegree.get(n) === 0).sort();
  const out = [];

  while (queue.length) {
    const n = queue.shift();
    out.push(n);
    for (const m of adj.get(n)) {
      indegree.set(m, indegree.get(m) - 1);
      if (indegree.get(m) === 0) {
        queue.push(m);
        queue.sort();
      }
    }
  }

  if (out.length !== names.length) {
    throw new Error("Cycle detected in modelLoadDependencies.");
  }

  return out;
}
