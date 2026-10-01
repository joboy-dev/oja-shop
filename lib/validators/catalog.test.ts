import { describe, expect, it } from "vitest";
import { parseShopFilters } from "./catalog";

describe("parseShopFilters", () => {
  it("applies defaults", () => {
    expect(parseShopFilters({})).toMatchObject({ sort: "newest", page: 1, pageSize: 12 });
  });
  it("parses naira ranges to kobo", () => {
    const f = parseShopFilters({ min: "5000", max: "20,000" });
    expect(f.minPrice).toBe(500_000);
    expect(f.maxPrice).toBe(2_000_000);
  });
  it("ignores garbage", () => {
    const f = parseShopFilters({ sort: "hax", page: "-4", min: "abc", stock: "yes" });
    expect(f.sort).toBe("newest");
    expect(f.page).toBe(1);
    expect(f.minPrice).toBeUndefined();
    expect(f.inStock).toBeUndefined();
  });
  it("takes the first of repeated params and trims q", () => {
    expect(parseShopFilters({ q: ["  mug ", "x"], page: ["3"] })).toMatchObject({ q: "mug", page: 3 });
  });
  it("carries the category through", () => {
    expect(parseShopFilters({}, "ceramics").category).toBe("ceramics");
  });
});
