import { z } from "zod";

export const createRoleBodySchema = z.object({
  roleName: z
    .string({ required_error: "roleName is required" })
    .trim()
    .min(1, "roleName is required"),
  roleDescription: z.string().nullable().optional().default(null),
});

export const updateRoleBodySchema = z
  .object({
    roleName: z.string().trim().min(1, "roleName cannot be empty").optional(),
    roleDescription: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields to update",
  });
