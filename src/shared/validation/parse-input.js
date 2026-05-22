/**
 * Client validation failure from {@link parseInput}. Mapped to HTTP 400 by {@link asyncHandler}.
 */
export class ValidationError extends Error {
  /**
   * @param {string} message
   * @param {unknown} [data]
   */
  constructor(message, data = null) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.data = data;
  }
}

/**
 * Parse and validate input with a Zod schema. Throws {@link ValidationError} on failure.
 *
 * @template {import("zod").ZodTypeAny} TSchema
 * @param {TSchema} schema
 * @param {unknown} input
 * @returns {import("zod").infer<TSchema>}
 */
export function parseInput(schema, input) {
  const result = schema.safeParse(input);

  if (!result.success) {
    const [issue] = result.error.issues;
    throw new ValidationError(
      issue?.message ?? "Validation failed",
      result.error.issues,
    );
  }

  return result.data;
}
