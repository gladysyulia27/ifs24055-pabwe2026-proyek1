import { describe, it, expect, vi } from "vitest";
import { notificationService, normalizeNotifications } from "@/services/notificationService";
import { notificationsApi } from "@/services/api";
import { NotificationsData } from "@/types";

describe("Notification Service Layer", () => {
  describe("normalizeNotifications", () => {
    it("preserves valid arrays for due_returns and pending", () => {
      const input: NotificationsData = {
        due_returns: [
          {
            id: 1,
            inventory_name: "Proyektor",
            borrower_name: "Gladys",
            department_name: "DESARPRAS",
            due_date: "2026-10-25"
          }
        ],
        pending: [
          {
            id: 2,
            inventory_name: "Kamera",
            borrower_name: "Rio",
            department_name: "DEPKOMINFO"
          }
        ]
      };

      const result = normalizeNotifications(input);
      expect(result.due_returns).toHaveLength(1);
      expect(result.pending).toHaveLength(1);
    });

    it("falls back to empty arrays when server response contains null or undefined", () => {
      const empty = normalizeNotifications({} as NotificationsData);
      expect(empty.due_returns).toEqual([]);
      expect(empty.pending).toEqual([]);
    });
  });

  describe("getNotifications", () => {
    it("fetches and returns normalized notification payload", async () => {
      const mockData: NotificationsData = {
        due_returns: [],
        pending: []
      };

      vi.spyOn(notificationsApi, "getNotifications").mockResolvedValue(mockData);

      const res = await notificationService.getNotifications();
      expect(res).toEqual({ due_returns: [], pending: [] });
    });
  });
});
