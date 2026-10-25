import { useMemo } from "react";
import { Item, User } from "@/types";
import { isDepartmentAdmin } from "@/utils/roles";

export interface ItemStockStatus {
  inStock: boolean;
  stockPercent: number;
  bucket: number;
  isDanger: boolean;
  isWarning: boolean;
  isOwnDepartment: boolean;
}

/**
 * Custom hook to extract inventory item stock calculations, thresholds,
 * and ownership checks away from the ItemCard UI presentation component.
 */
export function useItemStock(item: Item, currentUser: User | null): ItemStockStatus {
  return useMemo(() => {
    const total = Number(item.total_stock) || 0;
    const available = Number(item.available_stock) || 0;
    const inStock = available > 0;
    const stockPercent = total > 0 ? Math.round((available / total) * 100) : 0;
    const bucket = Math.min(100, Math.max(0, Math.round(stockPercent / 10) * 10));

    const isDanger = stockPercent < 20;
    const isWarning = stockPercent >= 20 && stockPercent < 50;

    const isOwnDepartment =
      isDepartmentAdmin(currentUser) && currentUser?.department_id === item.department_id;

    return {
      inStock,
      stockPercent,
      bucket,
      isDanger,
      isWarning,
      isOwnDepartment
    };
  }, [item.total_stock, item.available_stock, item.department_id, currentUser]);
}
