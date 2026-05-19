import { createUserBodySchema } from "../../../modules/users/users.schemas.js";

describe("users.schemas", () => {
  it("createUserBodySchema normalizes email to lowercase", () => {
    const parsed = createUserBodySchema.parse({
      email: "User@Example.COM",
    });

    expect(parsed.email).toBe("user@example.com");
    expect(parsed.is_active).toBe(true);
  });

  it("createUserBodySchema rejects invalid email", () => {
    expect(() =>
      createUserBodySchema.parse({ email: "not-valid" }),
    ).toThrow();
  });
});
