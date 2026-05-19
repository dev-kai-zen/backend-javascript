import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockResponse } from "../../test/mock-response.js";

const {
  parseListFilters,
  listRefreshTokens,
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  revokeRefreshToken,
} = vi.hoisted(() => ({
  parseListFilters: vi.fn(),
  listRefreshTokens: vi.fn(),
  createRefreshToken: vi.fn(),
  getRefreshToken: vi.fn(),
  deleteRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
}));

vi.mock("./refresh-token.service.js", () => ({
  parseListFilters,
  listRefreshTokens,
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  revokeRefreshToken,
}));

const { getRefreshToken: getRefreshTokenHandler } = await import(
  "./refresh-token.controller.js"
);

describe("refresh-token.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getRefreshToken returns 400 when id is invalid", async () => {
    const res = createMockResponse();

    await getRefreshTokenHandler({ params: { id: "abc" } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      status: false,
      message: "Invalid id",
    });
    expect(getRefreshToken).not.toHaveBeenCalled();
  });

  it("getRefreshToken returns 404 when row is missing", async () => {
    getRefreshToken.mockResolvedValue(null);
    const res = createMockResponse();

    await getRefreshTokenHandler({ params: { id: "10" } }, res);

    expect(getRefreshToken).toHaveBeenCalledWith(10);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Refresh token not found");
  });

  it("getRefreshToken returns 200 when row exists", async () => {
    const row = { id: 10, userId: 1, token: "abc" };
    getRefreshToken.mockResolvedValue(row);
    const res = createMockResponse();

    await getRefreshTokenHandler({ params: { id: "10" } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      status: true,
      data: row,
    });
  });
});
