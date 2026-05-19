import { z } from "zod";

export const setUserRolesBodySchema = z.object({
  roleIds: z.array(z.coerce.number().int().positive(), {
    required_error: "roleIds array is required",
    invalid_type_error: "roleIds array is required",
  }),
  assignedBy: z.coerce.number().int().positive({
    message: "assignedBy must be a positive integer",
  }),
});

export const createUserRoleBodySchema = z.object({
  roleId: z.coerce.number().int().positive({
    message: "roleId must be a positive integer",
  }),
  assignedBy: z.coerce.number().int().positive({
    message: "assignedBy must be a positive integer",
  }),
});
