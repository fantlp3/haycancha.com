import { describe, expect, it } from "vitest";
import { heroImageSrcSet, heroImageUrl } from "./hero-images";

const ID = "4068b9b8-d43f-4b06-9e74-b42785021f0f";

describe("heroImageUrl", () => {
  it("usa 1280 por defecto, no 2000", () => {
    expect(heroImageUrl(ID)).toContain("width=1280");
    expect(heroImageUrl(ID)).not.toContain("width=2000");
  });

  it("respeta el ancho pedido", () => {
    expect(heroImageUrl(ID, 640)).toContain("width=640");
  });

  it("mantiene webp y quality 80", () => {
    const url = heroImageUrl(ID, 960);
    expect(url).toContain("format=webp");
    expect(url).toContain("quality=80");
  });
});

describe("heroImageSrcSet", () => {
  const srcset = heroImageSrcSet(ID);
  const entries = srcset.split(", ");

  it("ofrece los 5 anchos con su descriptor w", () => {
    expect(entries).toHaveLength(5);
    expect(entries.map((e) => e.split(" ")[1])).toEqual([
      "640w",
      "960w",
      "1280w",
      "1600w",
      "2000w",
    ]);
  });

  it("incluye un ancho chico para móvil", () => {
    expect(srcset).toContain("width=640");
  });

  it("cada entrada apunta al mismo asset", () => {
    for (const entry of entries) {
      expect(entry).toContain(ID);
    }
  });
});
