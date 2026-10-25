import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "src/utils/**",
        "src/services/authService.ts",
        "src/services/errorHandler.ts",
        "src/services/inventoryService.ts",
        "src/services/loanService.ts",
        "src/services/notificationService.ts",
        "src/hooks/useActionRunner.ts",
        "src/hooks/useAuth.ts",
        "src/hooks/useCalendarGrid.ts",
        "src/hooks/useDashboardStats.ts",
        "src/hooks/useFormSubmission.ts",
        "src/hooks/useInventoryFilter.ts",
        "src/hooks/useItemStock.ts"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src")
    }
  }
});
