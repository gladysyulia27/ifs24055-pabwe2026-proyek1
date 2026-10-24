import { describe, it, expect } from "vitest";
import {
  validateItemPayload,
  transformItem,
  transformItemList
} from "@/services/inventoryService";
import { Item } from "@/types";

describe("Inventory Service Logic", () => {
  describe("validateItemPayload", () => {
    it("approves valid item payload", () => {
      const res = validateItemPayload({
        name: "Proyektor Epson",
        department_id: 2,
        total_stock: 5
      });
      expect(res.isValid).toBe(true);
      expect(res.error).toBeNull();
    });

    it("rejects empty name", () => {
      const res = validateItemPayload({
        name: "   ",
        department_id: 2,
        total_stock: 5
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe("Nama barang wajib diisi.");
    });

    it("rejects negative stock", () => {
      const res = validateItemPayload({
        name: "Proyektor Epson",
        department_id: 2,
        total_stock: -3
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe("Stok harus berupa bilangan bulat non-negatif.");
    });
  });

  describe("transformItem", () => {
    const rawItem: Item = {
      id: 10,
      department_id: 1,
      department_name: "DEPKOMINFO",
      name: "Kamera Sony Alpha",
      category: "Kamera",
      description: "Kamera profesional",
      total_stock: 10,
      available_stock: 8,
      condition_status: "Bagus",
      image_url: ""
    };

    it("computes availability and stock percentage accurately", () => {
      const transformed = transformItem(rawItem);
      expect(transformed.stockPercent).toBe(80);
      expect(transformed.isAvailable).toBe(true);
      expect(transformed.statusBadgeClass).toBe("status-green");
      expect(transformed.displayImageUrl).toBeTruthy();
    });

    it("assigns status-red when stock is zero", () => {
      const outOfStock: Item = { ...rawItem, available_stock: 0 };
      const transformed = transformItem(outOfStock);
      expect(transformed.stockPercent).toBe(0);
      expect(transformed.isAvailable).toBe(false);
      expect(transformed.statusBadgeClass).toBe("status-red");
    });

    it("assigns status-orange when stock is below 30%", () => {
      const lowStock: Item = { ...rawItem, available_stock: 2, total_stock: 10 };
      const transformed = transformItem(lowStock);
      expect(transformed.stockPercent).toBe(20);
      expect(transformed.isAvailable).toBe(true);
      expect(transformed.statusBadgeClass).toBe("status-orange");
    });

    it("transforms an array of items via transformItemList", () => {
      const list = transformItemList([rawItem]);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(10);
    });
  });
});
