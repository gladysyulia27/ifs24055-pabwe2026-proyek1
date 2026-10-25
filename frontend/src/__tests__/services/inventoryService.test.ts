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

    it("handles total_stock <= 0 gracefully", () => {
      const zeroStockItem: Item = { ...rawItem, total_stock: 0, available_stock: 0 };
      const transformed = transformItem(zeroStockItem);
      expect(transformed.total_stock).toBe(0);
      expect(transformed.available_stock).toBe(0);
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

    it("falls back to /assets/kamera.png when image_url and static map are not available", () => {
      const unknownItem: Item = {
        ...rawItem,
        name: "Barang Tanpa Gambar",
        image_url: ""
      };
      const transformed = transformItem(unknownItem);
      expect(transformed.displayImageUrl).toBe("/assets/kamera.png");

      const itemWithUrl: Item = {
        ...rawItem,
        image_url: "https://img.example.com/custom.png"
      };
      expect(transformItem(itemWithUrl).displayImageUrl).toBe("https://img.example.com/custom.png");
    });

    it("transforms an array of items via transformItemList", () => {
      const list = transformItemList([rawItem]);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(10);
    });
  });

  describe("inventoryService CRUD API methods", () => {
    const mockItem: Item = {
      id: 1,
      department_id: 1,
      name: "Kamera Sony",
      category: "Elektronik",
      total_stock: 5,
      available_stock: 4
    } as Item;

    it("getAll fetches and returns transformed items", async () => {
      const { inventoryApi } = await import("@/services/api");
      vi.spyOn(inventoryApi, "getAll").mockResolvedValue([mockItem]);

      const items = await (await import("@/services/inventoryService")).inventoryService.getAll(1, "kamera");
      expect(items).toHaveLength(1);
      expect(items[0].isAvailable).toBe(true);
    });

    it("getAll handles API errors", async () => {
      const { inventoryApi } = await import("@/services/api");
      vi.spyOn(inventoryApi, "getAll").mockRejectedValue(new Error("Network failed"));

      await expect(
        (await import("@/services/inventoryService")).inventoryService.getAll()
      ).rejects.toThrowError();
    });

    it("create validates payload and calls API", async () => {
      const { inventoryApi } = await import("@/services/api");
      vi.spyOn(inventoryApi, "create").mockResolvedValue(mockItem);

      const created = await (await import("@/services/inventoryService")).inventoryService.create({
        name: "Kamera Sony",
        department_id: 1,
        total_stock: 5
      });
      expect(created.name).toBe("Kamera Sony");
    });

    it("create throws validation error on invalid payload", async () => {
      await expect(
        (await import("@/services/inventoryService")).inventoryService.create({
          name: "",
          department_id: 1,
          total_stock: 5
        })
      ).rejects.toThrowError();

      await expect(
        (await import("@/services/inventoryService")).inventoryService.create({
          name: "Valid",
          department_id: 0,
          total_stock: 5
        })
      ).rejects.toThrowError();
    });

    it("update validates delta and calls API", async () => {
      const { inventoryApi } = await import("@/services/api");
      vi.spyOn(inventoryApi, "update").mockResolvedValue(mockItem);

      const updated = await (await import("@/services/inventoryService")).inventoryService.update(1, {
        name: "Kamera Baru",
        total_stock: 6
      });
      expect(updated.name).toBe("Kamera Sony");
    });

    it("update throws validation error on invalid delta", async () => {
      await expect(
        (await import("@/services/inventoryService")).inventoryService.update(1, {
          name: "",
          total_stock: 5
        })
      ).rejects.toThrowError();
    });

    it("deletes item when valid ID is provided and rejects non-positive ID", async () => {
      const { inventoryApi } = await import("@/services/api");
      const { inventoryService } = await import("@/services/inventoryService");

      vi.spyOn(inventoryApi, "delete").mockResolvedValue({ success: true, message: "OK" });
      const res = await inventoryService.delete(5);
      expect(res.success).toBe(true);

      await expect(inventoryService.delete(0)).rejects.toThrowError();
    });

    it("handles API rejection across create, update, and delete", async () => {
      const { inventoryApi } = await import("@/services/api");
      const { inventoryService } = await import("@/services/inventoryService");

      vi.spyOn(inventoryApi, "create").mockRejectedValue(new Error("Server create error"));
      await expect(
        inventoryService.create({ name: "Kamera", department_id: 1, total_stock: 5 })
      ).rejects.toThrowError();

      vi.spyOn(inventoryApi, "update").mockRejectedValue(new Error("Server update error"));
      await expect(
        inventoryService.update(1, { name: "Kamera", total_stock: 5 })
      ).rejects.toThrowError();

      vi.spyOn(inventoryApi, "delete").mockRejectedValue(new Error("Server delete error"));
      await expect(inventoryService.delete(1)).rejects.toThrowError();
    });

    it("validates item payload with optional department_id and total_stock defaults", async () => {
      const { validateItemPayload } = await import("@/services/inventoryService");
      const res = validateItemPayload({ name: "Kamera" });
      expect(res.isValid).toBe(true);

      const invalidDept = validateItemPayload({ name: "Kamera", department_id: -5 });
      expect(invalidDept.isValid).toBe(false);
    });
  });
});
