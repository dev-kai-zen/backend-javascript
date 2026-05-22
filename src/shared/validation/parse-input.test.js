import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseInput, ValidationError } from "./parse-input.js";

describe("parseInput", () => {
  const schema = z.object({
    email: z.string().email(),
  });

  it("returns parsed data when input is valid", () => {
    const result = parseInput(schema, { email: "user@example.com" });
    expect(result.email).toBe("user@example.com");
  });

  it("throws ValidationError with statusCode 400 when input is invalid", () => {
    try {
      parseInput(schema, { email: "not-an-email" });
      expect.fail("expected ValidationError");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect(err.statusCode).toBe(400);
      expect(err.message).toMatch(/valid address|email/i);
      expect(Array.isArray(err.data)).toBe(true);
    }
  });
});
