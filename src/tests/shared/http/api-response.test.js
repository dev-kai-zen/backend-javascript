import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../../../shared/http/api-response.js";
import { createMockResponse } from "../../helpers/mock-response.js";

describe("api-response", () => {
  it("sendSuccess returns status true with default message", () => {
    const res = createMockResponse();
    sendSuccess(res, { data: { id: 1 } });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "Success",
      data: { id: 1 },
    });
  });

  it("sendSuccess honors custom statusCode and message", () => {
    const res = createMockResponse();
    sendSuccess(res, {
      message: "User created successfully",
      statusCode: 201,
      data: null,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
    expect(res.body.status).toBe(true);
  });

  it("sendError returns status false", () => {
    const res = createMockResponse();
    sendError(res, { message: "Not found", statusCode: 404 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: false,
      message: "Not found",
      data: null,
    });
  });

  it("sendValidationError returns 400", () => {
    const res = createMockResponse();
    sendValidationError(res, { message: "invalid id" });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("invalid id");
  });
});
