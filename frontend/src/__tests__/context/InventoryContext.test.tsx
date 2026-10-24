import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { InventoryProvider, useInventory } from "@/context/InventoryContext";
import { DataProvider, useData } from "@/context/DataContext";
import { UIProvider, useUI } from "@/context/UIContext";

describe("Contexts Modularization", () => {
  it("throws error when useData is used outside DataProvider", () => {
    expect(() => renderHook(() => useData())).toThrow(
      "useData must be used within a DataProvider"
    );
  });

  it("throws error when useUI is used outside UIProvider", () => {
    expect(() => renderHook(() => useUI())).toThrow(
      "useUI must be used within a UIProvider"
    );
  });

  it("provides full inventory context through useInventory inside InventoryProvider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>
        <InventoryProvider>{children}</InventoryProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => useInventory(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.items).toEqual([]);
    expect(result.current.loans).toEqual([]);
    expect(result.current.departments).toEqual([]);
    expect(typeof result.current.refresh).toBe("function");
    expect(typeof result.current.showToast).toBe("function");
    expect(typeof result.current.openBorrowModal).toBe("function");
  });
});
