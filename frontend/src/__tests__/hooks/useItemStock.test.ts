import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useItemStock } from "@/hooks/useItemStock";
import { Item, User } from "@/types";

describe("useItemStock hook", () => {
  const dummyItem: Item = {
    id: 1,
    department_id: 1,
    name: "Kamera",
    category: "Elektronik",
    total_stock: 10,
    available_stock: 1, // 10% -> danger
    description: "",
    condition_status: "Baik"
  };

  const adminUser: User = {
    id: 10,
    username: "admin_kominfo",
    email: "admin@del.ac.id",
    role: "admin_departemen",
    department_id: 1,
    full_name: "Admin Kominfo",
    identifier: "ADM-01",
    department_name: "DEPKOMINFO",
    contact_phone: ""
  };

  const otherAdminUser: User = {
    ...adminUser,
    department_id: 2
  };

  const studentUser: User = {
    ...adminUser,
    role: "mahasiswa"
  };

  it("calculates danger status when stock percentage is under 20%", () => {
    const { result } = renderHook(() => useItemStock(dummyItem, adminUser));

    expect(result.current.inStock).toBe(true);
    expect(result.current.stockPercent).toBe(10);
    expect(result.current.isDanger).toBe(true);
    expect(result.current.isWarning).toBe(false);
    expect(result.current.isOwnDepartment).toBe(true);
  });

  it("calculates warning status when stock percentage is between 20% and 50%", () => {
    const warningItem: Item = {
      ...dummyItem,
      total_stock: 10,
      available_stock: 4 // 40%
    };
    const { result } = renderHook(() => useItemStock(warningItem, otherAdminUser));

    expect(result.current.stockPercent).toBe(40);
    expect(result.current.isDanger).toBe(false);
    expect(result.current.isWarning).toBe(true);
    expect(result.current.isOwnDepartment).toBe(false);
  });

  it("calculates normal status when stock percentage is 50% or higher", () => {
    const normalItem: Item = {
      ...dummyItem,
      total_stock: 10,
      available_stock: 8 // 80%
    };
    const { result } = renderHook(() => useItemStock(normalItem, studentUser));

    expect(result.current.stockPercent).toBe(80);
    expect(result.current.isDanger).toBe(false);
    expect(result.current.isWarning).toBe(false);
    expect(result.current.isOwnDepartment).toBe(false);
  });

  it("handles zero total stock and null user gracefully", () => {
    const zeroItem: Item = {
      ...dummyItem,
      total_stock: 0,
      available_stock: 0
    };
    const { result } = renderHook(() => useItemStock(zeroItem, null));

    expect(result.current.inStock).toBe(false);
    expect(result.current.stockPercent).toBe(0);
    expect(result.current.isDanger).toBe(true);
    expect(result.current.isOwnDepartment).toBe(false);
  });
});
