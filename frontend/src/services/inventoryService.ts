import { Item, ItemPayload, TransformedItem, ValidationResult } from "@/types";
import { inventoryApi } from "./api";
import { getItemImage } from "@/utils/itemImage";
import { validateItemForm } from "@/utils/validation";

/**
 * Validates inventory item creation and modification payload.
 */
export function validateItemPayload(payload: Partial<ItemPayload>): ValidationResult {
  const error = validateItemForm({
    name: payload.name || "",
    total_stock: payload.total_stock ?? 0
  });

  if (error) {
    return { isValid: false, error };
  }

  if (payload.department_id !== undefined && (!payload.department_id || payload.department_id <= 0)) {
    return { isValid: false, error: "Departemen pemilik barang harus dipilih secara valid." };
  }

  return { isValid: true, error: null };
}

/**
 * Transforms a raw API item into a presentation-ready model with computed availability and visual cues.
 */
export function transformItem(item: Item): TransformedItem {
  const total = Number(item.total_stock) || 0;
  const available = Number(item.available_stock) || 0;
  const stockPercent = total > 0 ? Math.round((available / total) * 100) : 0;
  const isAvailable = available > 0;

  let statusBadgeClass = "status-green";
  if (available <= 0) {
    statusBadgeClass = "status-red";
  } else if (stockPercent < 30) {
    statusBadgeClass = "status-orange";
  }

  const displayImageUrl = item.image_url?.trim()
    ? item.image_url
    : getItemImage(item) || "/assets/kamera.png";

  return {
    ...item,
    total_stock: total,
    available_stock: available,
    stockPercent,
    isAvailable,
    statusBadgeClass,
    displayImageUrl
  };
}

/**
 * Transforms an array of items.
 */
export function transformItemList(items: Item[]): TransformedItem[] {
  return items.map(transformItem);
}

/**
 * Inventory Service Layer isolating business validation, API communication, and data transformation.
 */
export const inventoryService = {
  /**
   * Retrieves all inventory items with optional department and search filters,
   * returning transformed domain entities.
   */
  async getAll(departmentId?: number, search?: string): Promise<TransformedItem[]> {
    const rawItems = await inventoryApi.getAll(departmentId, search);
    return transformItemList(rawItems);
  },

  /**
   * Creates a new inventory item after validating the payload.
   */
  async create(payload: ItemPayload): Promise<TransformedItem> {
    const validation = validateItemPayload(payload);
    if (!validation.isValid) {
      throw new Error(validation.error || "Validasi data barang gagal.");
    }

    const created = await inventoryApi.create(payload);
    return transformItem(created);
  },

  /**
   * Updates an existing inventory item after validating the delta.
   */
  async update(id: number, payload: Partial<Omit<ItemPayload, "department_id">>): Promise<TransformedItem> {
    const validation = validateItemPayload(payload);
    if (!validation.isValid) {
      throw new Error(validation.error || "Validasi data barang gagal.");
    }

    const updated = await inventoryApi.update(id, payload);
    return transformItem(updated);
  },

  /**
   * Deletes an inventory item by ID.
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    if (!id || id <= 0) {
      throw new Error("ID barang tidak valid.");
    }
    return inventoryApi.delete(id);
  }
};
