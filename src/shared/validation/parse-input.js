/**
 * Parse and validate input with a Zod schema. Throws a plain `Error` with a readable message.
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
    throw new Error(issue?.message ?? "Validation failed");
  }

  return result.data;
}
