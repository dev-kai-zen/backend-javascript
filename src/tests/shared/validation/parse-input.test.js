import { z } from "zod";

import { parseInput } from "../../../shared/validation/parse-input.js";

describe("parseInput", () => {
  const schema = z.object({
    email: z.string().email(),
  });

  it("returns parsed data when input is valid", () => {
    const result = parseInput(schema, { email: "user@example.com" });
    expect(result.email).toBe("user@example.com");
  });

  it("throws with Zod issue message when input is invalid", () => {
    expect(() => parseInput(schema, { email: "not-an-email" })).toThrow(
      /valid address|email/i,
    );
  });
});
