import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES, validateImageFile } from "./rules";

describe("validateImageFile", () => {
  it("accepts normal images", () => {
    expect(validateImageFile({ type: "image/webp", size: 400_000 })).toBeNull();
    expect(validateImageFile({ type: "image/jpeg", size: MAX_UPLOAD_BYTES })).toBeNull();
  });
  it("rejects wrong types", () => {
    expect(validateImageFile({ type: "application/x-msdownload", size: 1000 })).toMatch(/JPEG/);
    expect(validateImageFile({ type: "image/svg+xml", size: 1000 })).toMatch(/JPEG/);
  });
  it("rejects oversized and empty files with a clear message", () => {
    expect(validateImageFile({ type: "image/png", size: 11 * 1024 * 1024 })).toMatch(/11\.0 MB.*10 MB/);
    expect(validateImageFile({ type: "image/png", size: 0 })).toMatch(/empty/);
  });
});
