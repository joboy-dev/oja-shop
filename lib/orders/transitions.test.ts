import { describe, expect, it } from "vitest";
import { allowedNextStatuses, canTransition, isFinalStatus } from "./transitions";

describe("order status transitions", () => {
  it("moves forward through the normal flow", () => {
    expect(canTransition("confirmed", "processing")).toBe(true);
    expect(canTransition("processing", "shipped")).toBe(true);
    expect(canTransition("shipped", "delivered")).toBe(true);
  });
  it("never goes backwards or skips delivery", () => {
    expect(canTransition("shipped", "processing")).toBe(false);
    expect(canTransition("confirmed", "delivered")).toBe(false);
    expect(canTransition("processing", "confirmed")).toBe(false);
  });
  it("cannot cancel once shipped", () => {
    expect(canTransition("shipped", "cancelled")).toBe(false);
    expect(canTransition("processing", "cancelled")).toBe(true);
  });
  it("treats delivered and cancelled as final", () => {
    expect(isFinalStatus("delivered")).toBe(true);
    expect(isFinalStatus("cancelled")).toBe(true);
    expect(allowedNextStatuses("delivered")).toEqual([]);
    expect(isFinalStatus("confirmed")).toBe(false);
  });
});
