import { z } from "zod";

const nullableStringField = z.string().nullable().optional();

export const createUserLogBodySchema = z.object({
  action: z
    .string({ required_error: "action is required" })
    .trim()
    .min(1, "action is required"),
  userId: z.union([z.null(), z.coerce.number()]).optional(),
  module: z.string().optional(),
  description: nullableStringField,
  method: nullableStringField,
  route: nullableStringField,
  statusCode: z.union([z.null(), z.coerce.number()]).optional(),
  ipAddress: nullableStringField,
  userAgent: nullableStringField,
  deviceType: nullableStringField,
  browser: nullableStringField,
  os: nullableStringField,
  sessionId: nullableStringField,
  metadata: z
    .union([z.null(), z.record(z.unknown())])
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === null ||
        (typeof val === "object" && !Array.isArray(val)),
      { message: "metadata must be a plain object or null" },
    ),
});
