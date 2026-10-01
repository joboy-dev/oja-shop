import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-redirect";

describe("safeNext", () => {
  it("allows relative paths", () => {
    expect(safeNext("/checkout")).toBe("/checkout");
    expect(safeNext("/account/orders?x=1")).toBe("/account/orders?x=1");
  });
  it("blocks open redirects", () => {
    expect(safeNext("https://evil.com")).toBe("/");
    expect(safeNext("//evil.com")).toBe("/");
    expect(safeNext("/\\evil.com")).toBe("/");
    expect(safeNext("javascript:alert(1)")).toBe("/");
  });
  it("falls back when missing", () => {
    expect(safeNext(undefined)).toBe("/");
    expect(safeNext(null, "/home")).toBe("/home");
    expect(safeNext(["/a", "/b"])).toBe("/a");
  });
});
