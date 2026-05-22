import { describe, expect, it, vi } from "vitest";

import { ValidationError } from "../validation/parse-input.js";
import { asyncHandler } from "./async-handler.js";

describe("asyncHandler", () => {
  it("maps ValidationError to 400 validation envelope", async () => {
    const handler = asyncHandler(async () => {
      throw new ValidationError("Invalid email", [{ path: ["email"] }]);
    });

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await handler({}, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Invalid email",
      data: [{ path: ["email"] }],
    });
  });
});
