import { z } from "zod";

const categoryIdSchema = z.union([
  z.null(),
  z.coerce.number().int().nonnegative(),
]);

export const createPermissionBodySchema = z.object({
  permissionCode: z
    .string({ required_error: "permissionCode is required" })
    .trim()
    .min(1, "permissionCode is required"),
  permissionDescription: z.string().nullable().optional().default(null),
  categoryId: categoryIdSchema.optional().default(null),
});

export const updatePermissionBodySchema = z
  .object({
    permissionCode: z
      .string()
      .trim()
      .min(1, "permissionCode cannot be empty")
      .optional(),
    permissionDescription: z.string().nullable().optional(),
    categoryId: categoryIdSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields to update",
  });
