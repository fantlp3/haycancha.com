import { describe, expect, it } from "vitest";
import { resolveCanonical } from "./SeoMeta";

describe("resolveCanonical", () => {
  it("prefixes a bare path with the site origin", () => {
    expect(resolveCanonical("/blog/saque-en-tenis")).toBe(
      "https://haycancha.com/blog/saque-en-tenis"
    );
  });

  it("tolerates a path without a leading slash", () => {
    expect(resolveCanonical("blog/saque-en-tenis")).toBe(
      "https://haycancha.com/blog/saque-en-tenis"
    );
  });

  it("does NOT double-prefix a value that is already absolute", () => {
    // Regression: Directus `url_canonical` is stored fully qualified and used
    // to produce https://haycancha.comhttps://haycancha.com/blog/<slug>.
    expect(resolveCanonical("https://haycancha.com/blog/saque-en-tenis")).toBe(
      "https://haycancha.com/blog/saque-en-tenis"
    );
  });

  it("handles protocol-relative URLs", () => {
    expect(resolveCanonical("//haycancha.com/blog/x")).toBe(
      "https://haycancha.com/blog/x"
    );
  });

  it("returns undefined for empty or missing values", () => {
    expect(resolveCanonical(undefined)).toBeUndefined();
    expect(resolveCanonical("")).toBeUndefined();
    expect(resolveCanonical("   ")).toBeUndefined();
  });
});
