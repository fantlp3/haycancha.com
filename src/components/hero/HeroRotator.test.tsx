import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HeroImage } from "@/lib/hero-images";

const IMAGES: HeroImage[] = Array.from({ length: 29 }, (_, i) => ({
  id: `img-${i}`,
  deporte: "tenis",
  imagen: `file-${i}`,
  unsplash_url: "https://unsplash.com/x",
  unsplash_author: `Autor ${i}`,
  unsplash_author_url: "https://unsplash.com/@x",
  orden: i,
}));

vi.mock("@/lib/hero-images", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/hero-images")>();
  return { ...actual, fetchHeroImages: vi.fn(async () => IMAGES) };
});

const { HeroRotator } = await import("./HeroRotator");

describe("HeroRotator", () => {
  beforeEach(() => {
    // jsdom no implementa matchMedia
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("monta como máximo 3 imágenes aunque haya 29 activas", async () => {
    const { container } = render(<HeroRotator>contenido</HeroRotator>);
    await waitFor(() => {
      expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
    });
    // actual + siguiente + anterior, nunca las 29
    expect(container.querySelectorAll("img").length).toBeLessThanOrEqual(3);
  });

  it("la imagen visible se carga eager y con fetchpriority high", async () => {
    const { container } = render(<HeroRotator>contenido</HeroRotator>);
    await waitFor(() => {
      expect(container.querySelector("img")).not.toBeNull();
    });
    const eager = container.querySelectorAll('img[loading="eager"]');
    expect(eager).toHaveLength(1);
    expect(eager[0].getAttribute("fetchpriority")).toBe("high");
  });

  it("cada imagen lleva srcset con anchos chicos y sizes=100vw", async () => {
    const { container } = render(<HeroRotator>contenido</HeroRotator>);
    await waitFor(() => {
      expect(container.querySelector("img")).not.toBeNull();
    });
    for (const img of container.querySelectorAll("img")) {
      expect(img.getAttribute("sizes")).toBe("100vw");
      expect(img.getAttribute("srcset")).toContain("width=640");
      expect(img.getAttribute("srcset")).toContain("640w");
    }
  });

  it("ninguna imagen se pide a 2000 en el src", async () => {
    const { container } = render(<HeroRotator>contenido</HeroRotator>);
    await waitFor(() => {
      expect(container.querySelector("img")).not.toBeNull();
    });
    for (const img of container.querySelectorAll("img")) {
      expect(img.getAttribute("src")).not.toContain("width=2000");
    }
  });

  it("sigue renderizando el contenido y la atribución de Unsplash", async () => {
    render(<HeroRotator>hola mundo</HeroRotator>);
    expect(screen.getByText("hola mundo")).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText("Autor 0")).toBeTruthy();
    });
  });
});
