import { z } from "zod";

export const setRolePermissionsBodySchema = z.object({
  permissionIds: z.array(z.coerce.number().int().positive(), {
    required_error: "permissionIds array is required",
    invalid_type_error: "permissionIds array is required",
  }),
});

export const createRolePermissionBodySchema = z.object({
  permissionId: z.coerce.number().int().positive({
    message: "permissionId must be a positive integer",
  }),
});
