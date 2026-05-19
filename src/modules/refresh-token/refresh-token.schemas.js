import { z } from "zod";

export const createRefreshTokenBodySchema = z.object({
  userId: z.coerce.number().int().positive({
    message: "userId must be a positive integer",
  }),
  token: z
    .string({ required_error: "token is required" })
    .trim()
    .min(1, "token is required")
    .max(512, "token must be at most 512 characters"),
  expiresAt: z
    .string({ required_error: "expiresAt must be a valid ISO date string" })
    .trim()
    .min(1, "expiresAt must be a valid ISO date string")
    .transform((value, ctx) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "expiresAt must be a valid ISO date string",
        });
        return z.NEVER;
      }
      return date;
    }),
});

export const revokeRefreshTokenBodySchema = z.object({
  token: z
    .string({ required_error: "token is required" })
    .trim()
    .min(1, "token is required")
    .max(512, "token must be at most 512 characters"),
});
