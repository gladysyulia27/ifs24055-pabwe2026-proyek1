import { describe, it, expect } from "vitest";
import { toDateKey, todayISO } from "@/utils/date";

describe("Date Utilities", () => {
  describe("toDateKey", () => {
    it("formats year, month index, and day as YYYY-MM-DD", () => {
      // October 25, 2026 (month index 9 for October)
      expect(toDateKey(2026, 9, 25)).toBe("2026-10-25");
      // January 5, 2026 (month index 0 for January)
      expect(toDateKey(2026, 0, 5)).toBe("2026-01-05");
    });
  });

  describe("todayISO", () => {
    it("returns ISO formatted date string (YYYY-MM-DD)", () => {
      const today = todayISO();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
