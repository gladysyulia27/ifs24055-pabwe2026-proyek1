import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { compressImageFile, MAX_PHOTO_BYTES } from "@/utils/imageCompression";

describe("imageCompression utils", () => {
  let originalFileReader: typeof FileReader;
  let originalImage: typeof Image;
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    originalFileReader = global.FileReader;
    originalImage = global.Image;
    originalCreateElement = document.createElement.bind(document);
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
    global.Image = originalImage;
    document.createElement = originalCreateElement;
  });

  it("exports MAX_PHOTO_BYTES constant of 5MB", () => {
    expect(MAX_PHOTO_BYTES).toBe(5 * 1024 * 1024);
  });

  it("compresses and scales an image within max dimensions", async () => {
    class MockFileReader {
      result = "data:image/png;base64,mockdata";
      onload: (() => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    global.FileReader = MockFileReader as unknown as typeof FileReader;

    class MockImage {
      width = 800;
      height = 600;
      onload: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    const mockContext = {
      drawImage: vi.fn()
    };
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockContext),
      toDataURL: vi.fn().mockReturnValue("data:image/webp;base64,compressed")
    };
    document.createElement = vi.fn().mockImplementation((tag: string) => {
      if (tag === "canvas") return mockCanvas as unknown as HTMLElement;
      return originalCreateElement(tag);
    });

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const result = await compressImageFile(file);

    expect(result).toBe("data:image/webp;base64,compressed");
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
  });

  it("scales down large images exceeding MAX_DIMENSION (1200px)", async () => {
    class MockFileReader {
      result = "data:image/png;base64,large";
      onload: (() => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    global.FileReader = MockFileReader as unknown as typeof FileReader;

    class MockImage {
      width = 2400;
      height = 1200;
      onload: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toDataURL: vi.fn().mockReturnValue("data:image/webp;base64,scaled")
    };
    document.createElement = vi.fn().mockReturnValue(mockCanvas as unknown as HTMLElement);

    const file = new File(["large"], "large.png", { type: "image/png" });
    const result = await compressImageFile(file);

    expect(result).toBe("data:image/webp;base64,scaled");
    expect(mockCanvas.width).toBe(1200);
    expect(mockCanvas.height).toBe(600);
  });

  it("returns raw source if canvas 2D context is unavailable", async () => {
    class MockFileReader {
      result = "data:image/png;base64,fallback";
      onload: (() => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    global.FileReader = MockFileReader as unknown as typeof FileReader;

    class MockImage {
      width = 100;
      height = 100;
      onload: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(null)
    };
    document.createElement = vi.fn().mockReturnValue(mockCanvas as unknown as HTMLElement);

    const file = new File(["test"], "test.png", { type: "image/png" });
    const result = await compressImageFile(file);

    expect(result).toBe("data:image/png;base64,fallback");
  });

  it("handles FileReader and Image load errors gracefully", async () => {
    class ErrorFileReader {
      error = new Error("File read error");
      onerror: (() => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onerror?.(), 0);
      }
    }
    global.FileReader = ErrorFileReader as unknown as typeof FileReader;

    const file = new File(["error"], "error.png");
    await expect(compressImageFile(file)).rejects.toThrow();

    class MockFileReader {
      result = "data:invalid";
      onload: (() => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    global.FileReader = MockFileReader as unknown as typeof FileReader;

    class ErrorImage {
      onerror: ((err: unknown) => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onerror?.(new Error("Image decode failed")), 0);
      }
    }
    global.Image = ErrorImage as unknown as typeof Image;

    await expect(compressImageFile(file)).rejects.toThrow();
  });
});
