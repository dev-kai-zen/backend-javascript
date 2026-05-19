import { describe, expect, it } from "vitest";

import { createRefreshTokenBodySchema } from "./refresh-token.schemas.js";

describe("refresh-token.schemas", () => {
  it("accepts valid create body and parses expiresAt to Date", () => {
    const parsed = createRefreshTokenBodySchema.parse({
      userId: "5",
      token: "my-refresh-token",
      expiresAt: "2026-12-31T23:59:59.000Z",
    });

    expect(parsed.userId).toBe(5);
    expect(parsed.token).toBe("my-refresh-token");
    expect(parsed.expiresAt).toBeInstanceOf(Date);
  });

  it("rejects missing token", () => {
    expect(() =>
      createRefreshTokenBodySchema.parse({
        userId: 1,
        expiresAt: "2026-12-31T23:59:59.000Z",
      }),
    ).toThrow(/token/i);
  });
});
