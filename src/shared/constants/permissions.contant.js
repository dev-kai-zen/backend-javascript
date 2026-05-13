/**
 * Permission codes for guards, policies, and clients.
 *
 * Category names, descriptions, and DB seed grouping are defined separately in
 * `database/seed-data/rbac-permission-seed-catalog.js` (consumed by the RBAC seeder).
 */
export const PERMISSIONS = {
  USER_MANAGEMENT: {
    READ: "user_management:read",
    WRITE: "user_management:write",
    UPDATE: "user_management:update",
    DELETE: "user_management:delete",
  },
  ROLE_MANAGEMENT: {
    READ: "role_management:read",
    WRITE: "role_management:write",
    UPDATE: "role_management:update",
    DELETE: "role_management:delete",
  },
  CONTENT_MANAGEMENT: {
    READ: "content_management:read",
    WRITE: "content_management:write",
    UPDATE: "content_management:update",
    DELETE: "content_management:delete",
  },
  AUDIT_LOG_MANAGEMENT: {
    READ: "audit_log_management:read",
  },
  USER_LOGS_MANAGEMENT: {
    READ: "user_logs_management:read",
     },
};
