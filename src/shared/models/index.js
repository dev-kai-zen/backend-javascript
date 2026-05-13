/**
 * Central Sequelize model registry (same idea as wellness-and-safety-be `shared/models/index.js`).
 * Import once at process startup — before `sequelize.authenticate()` — so every `Model.init`
 * and association runs in a stable order without scattering side-effect imports in `index.ts`.
 */
import { sequelize } from "../../config/sequelize-config.js";

// Import models here

export const models = {};

export { sequelize };
