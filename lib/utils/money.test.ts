import { describe, expect, it } from "vitest";
import { formatMoney, nairaToKobo } from "./money";

describe("money", () => {
  it("formats whole naira without decimals", () => {
    expect(formatMoney(1_250_000)).toBe("₦12,500");
  });
  it("keeps kobo when present", () => {
    expect(formatMoney(1_250_050)).toBe("₦12,500.50");
  });
  it("parses typed naira to kobo", () => {
    expect(nairaToKobo("12,500.50")).toBe(1_250_050);
    expect(nairaToKobo("₦ 100")).toBe(10_000);
    expect(nairaToKobo("abc")).toBeNull();
    expect(nairaToKobo(-5)).toBeNull();
  });
});
