import { describe, expect, it } from "vitest";

import { parseListFilters } from "./refresh-token.service.js";

describe("refresh-token.service parseListFilters", () => {
  it("returns empty filters when userId is omitted", () => {
    expect(parseListFilters(undefined)).toEqual({});
  });

  it("parses numeric userId from query string", () => {
    expect(parseListFilters("42")).toEqual({ userId: 42 });
  });

  it("ignores invalid userId", () => {
    expect(parseListFilters("not-a-number")).toEqual({});
  });
});
