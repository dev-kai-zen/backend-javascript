"use strict";

const path = require("path");
const { pathToFileURL } = require("url");

/**
 * Seeds `rbac_categories` + `rbac_permissions` from
 * `database/seed-data/rbac-permission-seed-catalog.js` (`RBAC_SEED_CATALOG`).
 *
 * Permission string values stay in `src/shared/constants/permissions.contant.js` (`PERMISSIONS`).
 *
 * Idempotent:
 * - **Categories**: active row by `category_name` → skip; soft-deleted → restore; else insert.
 * - **Permissions**: active by `permission_code` → skip; soft-deleted → restore (refresh
 *   `category_id`, `permission_description`); else insert.
 *
 * Run: `npm run seed:all` or
 * `npx sequelize-cli db:seed --seed 20260523120001-seed-rbac-permissions-from-constants.cjs`
 *
 * Undo: `npx sequelize-cli db:seed:undo --seed 20260523120001-seed-rbac-permissions-from-constants.cjs`
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const abs = path.resolve(
      __dirname,
      "..",
      "seed-data",
      "rbac-permission-seed-catalog.js",
    );
    const { RBAC_SEED_CATALOG } = await import(pathToFileURL(abs).href);

    if (
      !Array.isArray(RBAC_SEED_CATALOG) ||
      RBAC_SEED_CATALOG.length === 0
    ) {
      return;
    }

    const now = new Date();

    for (const cat of RBAC_SEED_CATALOG) {
      const category_name = cat.categoryName;
      if (!category_name || typeof category_name !== "string") continue;

      const categoryId = await ensureCategory(queryInterface, category_name, now);
      const permissions = Array.isArray(cat.permissions) ? cat.permissions : [];

      for (const perm of permissions) {
        const permission_code =
          perm && typeof perm.code === "string" ? perm.code : null;
        if (!permission_code) continue;

        const permission_description =
          perm.description != null && typeof perm.description === "string"
            ? perm.description
            : null;

        await ensurePermission(queryInterface, {
          permission_code,
          permission_description,
          category_id: categoryId,
          now,
        });
      }
    }
  },

  async down(queryInterface) {
    const abs = path.resolve(
      __dirname,
      "..",
      "seed-data",
      "rbac-permission-seed-catalog.js",
    );
    const { RBAC_SEED_CATALOG } = await import(pathToFileURL(abs).href);

    if (
      !Array.isArray(RBAC_SEED_CATALOG) ||
      RBAC_SEED_CATALOG.length === 0
    ) {
      return;
    }

    const codes = [
      ...new Set(
        RBAC_SEED_CATALOG.flatMap((c) =>
          (Array.isArray(c.permissions) ? c.permissions : [])
            .map((p) => (p && typeof p.code === "string" ? p.code : null))
            .filter(Boolean),
        ),
      ),
    ];
    const categoryNames = [
      ...new Set(
        RBAC_SEED_CATALOG.map((c) =>
          c && typeof c.categoryName === "string" ? c.categoryName : null,
        ).filter(Boolean),
      ),
    ];

    if (codes.length > 0) {
      const placeholders = codes.map(() => "?").join(", ");
      await queryInterface.sequelize.query(
        `UPDATE rbac_permissions
         SET deleted_at = CURRENT_TIMESTAMP(3), updated_at = CURRENT_TIMESTAMP(3)
         WHERE permission_code IN (${placeholders})
           AND deleted_at IS NULL`,
        { replacements: codes },
      );
    }

    if (categoryNames.length > 0) {
      const ph = categoryNames.map(() => "?").join(", ");
      await queryInterface.sequelize.query(
        `UPDATE rbac_categories c
         SET c.deleted_at = CURRENT_TIMESTAMP(3), c.updated_at = CURRENT_TIMESTAMP(3)
         WHERE c.category_name IN (${ph})
           AND c.deleted_at IS NULL
           AND NOT EXISTS (
             SELECT 1 FROM rbac_permissions p
             WHERE p.category_id = c.id AND p.deleted_at IS NULL
           )`,
        { replacements: categoryNames },
      );
    }
  },
};

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} category_name
 * @param {Date} now
 * @returns {Promise<number>}
 */
async function ensureCategory(queryInterface, category_name, now) {
  const [existing] = await queryInterface.sequelize.query(
    `SELECT id, deleted_at FROM rbac_categories WHERE category_name = ? LIMIT 1`,
    { replacements: [category_name] },
  );

  const row =
    Array.isArray(existing) && existing.length > 0
      ? /** @type {{ id: number; deleted_at: Date | null }} */ (existing[0])
      : null;

  if (row && row.deleted_at == null) return row.id;

  if (row && row.deleted_at != null) {
    await queryInterface.sequelize.query(
      `UPDATE rbac_categories
       SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP(3)
       WHERE id = ?`,
      { replacements: [row.id] },
    );
    return row.id;
  }

  await queryInterface.bulkInsert(
    "rbac_categories",
    [
      {
        category_name,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ],
    {},
  );

  const [inserted] = await queryInterface.sequelize.query(
    `SELECT id FROM rbac_categories WHERE category_name = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
    { replacements: [category_name] },
  );
  const idRow =
    Array.isArray(inserted) && inserted.length > 0
      ? /** @type {{ id: number }} */ (inserted[0])
      : null;
  if (!idRow) {
    throw new Error(
      `ensureCategory: could not read id after insert for "${category_name}"`,
    );
  }
  return idRow.id;
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {{
 *   permission_code: string;
 *   permission_description: string | null;
 *   category_id: number;
 *   now: Date;
 * }} args
 */
async function ensurePermission(
  queryInterface,
  { permission_code, permission_description, category_id, now },
) {
  const [existing] = await queryInterface.sequelize.query(
    `SELECT id, deleted_at FROM rbac_permissions WHERE permission_code = ? LIMIT 1`,
    { replacements: [permission_code] },
  );

  const row =
    Array.isArray(existing) && existing.length > 0
      ? /** @type {{ id: number; deleted_at: Date | null }} */ (existing[0])
      : null;

  if (row && row.deleted_at == null) {
    await queryInterface.sequelize.query(
      `UPDATE rbac_permissions
       SET category_id = ?,
           permission_description = ?,
           updated_at = CURRENT_TIMESTAMP(3)
       WHERE id = ? AND deleted_at IS NULL`,
      { replacements: [category_id, permission_description, row.id] },
    );
    return;
  }

  if (row && row.deleted_at != null) {
    await queryInterface.sequelize.query(
      `UPDATE rbac_permissions
       SET deleted_at = NULL,
           is_active = true,
           category_id = ?,
           permission_description = ?,
           updated_at = CURRENT_TIMESTAMP(3)
       WHERE id = ?`,
      { replacements: [
        category_id,
        permission_description,
        row.id,
      ] },
    );
    return;
  }

  await queryInterface.bulkInsert(
    "rbac_permissions",
    [
      {
        permission_code,
        permission_description,
        category_id,
        is_active: true,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ],
    {},
  );
}
