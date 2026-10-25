import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

expect.extend(matchers);

// Clean up legacy workspace directories in CI if present
try {
  const legacyFrontend = path.resolve(process.cwd(), "frontend");
  if (fs.existsSync(legacyFrontend)) {
    fs.rmSync(legacyFrontend, { recursive: true, force: true });
  }
} catch {
  // ignore
}

// Mock window.matchMedia if not implemented in jsdom
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    })
  });
}
