/**
 * RBAC seed input: maps display categories + descriptions to `PERMISSIONS` codes.
 * Edit this when you add categories or change copy; keep codes in `permissions.contant.js`.
 */
import { PERMISSIONS } from "../../src/shared/constants/permissions.contant.js";

/** @typedef {{ code: string; description?: string | null }} RbacSeedPermissionRow */

/**
 * Same shape the seeder expects: `categoryName` + `permissions[]` with `code` + optional `description`.
 * @type {Array<{ categoryName: string; permissions: RbacSeedPermissionRow[] }>}
 */
export const RBAC_SEED_CATALOG = [
  {
    categoryName: "User management",
    permissions: [
      { code: PERMISSIONS.USER_MANAGEMENT.READ, description: "Read user management" },
      { code: PERMISSIONS.USER_MANAGEMENT.WRITE, description: "Write user management" },
      { code: PERMISSIONS.USER_MANAGEMENT.UPDATE, description: "Update user management" },
      { code: PERMISSIONS.USER_MANAGEMENT.DELETE, description: "Delete user management" },
    ],
  },
  {
    categoryName: "Content management",
    permissions: [
      { code: PERMISSIONS.CONTENT_MANAGEMENT.READ, description: "Read content management" },
      { code: PERMISSIONS.CONTENT_MANAGEMENT.WRITE, description: "Write content management" },
      { code: PERMISSIONS.CONTENT_MANAGEMENT.UPDATE, description: "Update content management" },
      { code: PERMISSIONS.CONTENT_MANAGEMENT.DELETE, description: "Delete content management" },
    ],
  },
];
