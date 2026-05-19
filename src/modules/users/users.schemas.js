import { z } from "zod";

const emailSchema = z
  .string({ required_error: "email is required" })
  .trim()
  .min(1, "email is required")
  .email({ message: "email must look like a valid address" })
  .transform((value) => value.toLowerCase());

const optionalEmailSchema = z
  .string()
  .trim()
  .min(1, "email cannot be empty")
  .email({ message: "email must look like a valid address" })
  .transform((value) => value.toLowerCase())
  .optional();

const optionalTrimmedNullable = z
  .union([z.null(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }
    if (value === null || value === "") {
      return null;
    }
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  });

const optionalDateOrNull = z
  .union([z.null(), z.string(), z.date()])
  .optional()
  .transform((value, ctx) => {
    if (value === undefined) {
      return undefined;
    }
    if (value === null || value === "") {
      return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "last_login_at must be a valid date or null",
      });
      return z.NEVER;
    }
    return date;
  });

export const createUserBodySchema = z.object({
  email: emailSchema,
  full_name: optionalTrimmedNullable.default(null),
  google_id: optionalTrimmedNullable.default(null),
  picture_url: optionalTrimmedNullable.default(null),
  is_active: z.boolean().optional().default(true),
  last_login_at: z
    .union([z.string(), z.date()])
    .optional()
    .transform((value, ctx) => {
      if (value === undefined) {
        return null;
      }
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "last_login_at must be a valid date",
        });
        return z.NEVER;
      }
      return date;
    }),
});

export const updateUserBodySchema = z
  .object({
    email: optionalEmailSchema,
    full_name: optionalTrimmedNullable,
    google_id: optionalTrimmedNullable,
    picture_url: optionalTrimmedNullable,
    is_active: z.boolean().optional(),
    last_login_at: optionalDateOrNull,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "no fields to update",
  });
