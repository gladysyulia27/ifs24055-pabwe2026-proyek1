import { describe, it, expect } from "vitest";
import {
  sumTotalStock,
  sumAvailableStock,
  filterItems,
  ALL_DEPARTMENTS
} from "@/utils/inventory";
import { Item } from "@/types";

describe("inventory utils", () => {
  const dummyItems: Item[] = [
    {
      id: 1,
      name: "Kamera Sony",
      category: "Elektronik",
      department_id: 1,
      department_name: "DEPKOMINFO",
      total_stock: 5,
      available_stock: 3
    } as Item,
    {
      id: 2,
      name: "Bola Basket",
      category: "Olahraga",
      department_id: 2,
      department_name: "DEPOL",
      total_stock: 10,
      available_stock: 8
    } as Item
  ];

  it("calculates sum of total stock and available stock correctly", () => {
    expect(sumTotalStock(dummyItems)).toBe(15);
    expect(sumAvailableStock(dummyItems)).toBe(11);
    expect(sumTotalStock([])).toBe(0);
    expect(sumAvailableStock([])).toBe(0);
  });

  it("filters items by department and search query", () => {
    expect(filterItems(dummyItems, ALL_DEPARTMENTS, "")).toHaveLength(2);
    expect(filterItems(dummyItems, "DEPKOMINFO", "")).toHaveLength(1);
    expect(filterItems(dummyItems, "DEPKOMINFO", "kamera")).toHaveLength(1);
    expect(filterItems(dummyItems, "DEPKOMINFO", "basket")).toHaveLength(0);
    expect(filterItems(dummyItems, ALL_DEPARTMENTS, "olahraga")).toHaveLength(1);
  });
});
