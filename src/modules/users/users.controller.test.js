import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockResponse } from "../../test/mock-response.js";

const { getUserById, getUsers, createUser, updateUser, deleteUser } = vi.hoisted(
  () => ({
    getUserById: vi.fn(),
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  }),
);

vi.mock("./users.service.js", () => ({
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
}));

const { getUserById: getUserByIdHandler } = await import("./users.controller.js");

describe("users.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserById returns 400 when id is invalid", async () => {
    const res = createMockResponse();
    await getUserByIdHandler({ params: { id: "abc" } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      status: false,
      message: "invalid id",
    });
    expect(getUserById).not.toHaveBeenCalled();
  });

  it("getUserById returns 404 when user is missing", async () => {
    getUserById.mockResolvedValue(null);
    const res = createMockResponse();

    await getUserByIdHandler({ params: { id: "42" } }, res);

    expect(getUserById).toHaveBeenCalledWith(42);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("user not found");
  });

  it("getUserById returns 200 when user exists", async () => {
    const user = { id: 1, email: "a@b.com" };
    getUserById.mockResolvedValue(user);
    const res = createMockResponse();

    await getUserByIdHandler({ params: { id: "1" } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      status: true,
      data: user,
    });
  });
});
