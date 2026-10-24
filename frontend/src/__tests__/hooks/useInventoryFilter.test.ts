import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInventoryFilter } from "@/hooks/useInventoryFilter";
import { Item } from "@/types";

describe("useInventoryFilter hook", () => {
  const items: Item[] = [
    {
      id: 1,
      department_id: 1,
      department_name: "DEPKOMINFO",
      name: "Kamera Sony Alpha 7",
      category: "Kamera",
      description: "",
      total_stock: 5,
      available_stock: 4,
      condition_status: "Baik"
    },
    {
      id: 2,
      department_id: 1,
      department_name: "DEPKOMINFO",
      name: "Clip On Mic Wireless",
      category: "Audio",
      description: "",
      total_stock: 3,
      available_stock: 3,
      condition_status: "Baik"
    },
    {
      id: 3,
      department_id: 2,
      department_name: "DIPTEK",
      name: "Arduino Starter Kit",
      category: "Robotika",
      description: "",
      total_stock: 8,
      available_stock: 7,
      condition_status: "Baik"
    }
  ];

  it("filters items by department name", () => {
    const { result, rerender } = renderHook(
      ({ dept }) => useInventoryFilter(items, dept),
      { initialProps: { dept: "DEPKOMINFO" } }
    );

    expect(result.current.visibleItems).toHaveLength(2);
    expect(result.current.totalMatches).toBe(2);

    rerender({ dept: "DIPTEK" });
    expect(result.current.visibleItems).toHaveLength(1);
    expect(result.current.visibleItems[0].name).toBe("Arduino Starter Kit");
  });

  it("filters items interactively by query string", () => {
    const { result } = renderHook(() =>
      useInventoryFilter(items, "Semua Departemen")
    );

    expect(result.current.visibleItems).toHaveLength(3);

    act(() => {
      result.current.setSearch("Wireless");
    });

    expect(result.current.visibleItems).toHaveLength(1);
    expect(result.current.visibleItems[0].name).toBe("Clip On Mic Wireless");
  });
});
