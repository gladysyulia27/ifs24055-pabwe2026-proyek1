import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./frontend/src/test/setup.ts"],
    include: ["frontend/src/__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "frontend/src/utils/**",
        "frontend/src/services/authService.ts",
        "frontend/src/services/errorHandler.ts",
        "frontend/src/services/inventoryService.ts",
        "frontend/src/services/loanService.ts",
        "frontend/src/services/notificationService.ts",
        "frontend/src/hooks/useActionRunner.ts",
        "frontend/src/hooks/useAuth.ts",
        "frontend/src/hooks/useCalendarGrid.ts",
        "frontend/src/hooks/useDashboardStats.ts",
        "frontend/src/hooks/useFormSubmission.ts",
        "frontend/src/hooks/useInventoryFilter.ts",
        "frontend/src/hooks/useItemStock.ts"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./frontend/src")
    }
  }
});
