import { z } from "zod";

const jsonObjectOrNull = z.union([z.null(), z.record(z.unknown())]).optional();

const optionalTimestamp = z
  .union([z.string(), z.date()])
  .optional()
  .transform((value, ctx) => {
    if (value === undefined) {
      return undefined;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "timestamp must be a valid date",
      });
      return z.NEVER;
    }
    return date;
  });

export const auditLogItemSchema = z.object({
  user_id: z.union([z.null(), z.coerce.number().int()]).optional(),
  action: z
    .string({ required_error: "action is required" })
    .trim()
    .min(1, "action is required")
    .max(64, "action must be at most 64 characters"),
  entity_type: z
    .string({ required_error: "entity_type is required" })
    .trim()
    .min(1, "entity_type is required")
    .max(128, "entity_type must be at most 128 characters"),
  entity_id: z.union([z.null(), z.string().max(64)]).optional(),
  old_values: jsonObjectOrNull,
  new_values: jsonObjectOrNull,
  change_fields: z.union([z.null(), z.array(z.string())]).optional(),
  ip_address: z.union([z.null(), z.string().max(45)]).optional(),
  user_agent: z.union([z.null(), z.string()]).optional(),
  timestamp: optionalTimestamp,
});

export const createAuditLogsBodySchema = z.object({
  logs: z
    .array(auditLogItemSchema, {
      required_error: "logs array is required",
      invalid_type_error: "logs array is required",
    })
    .min(1, "logs must contain at least one entry"),
});
