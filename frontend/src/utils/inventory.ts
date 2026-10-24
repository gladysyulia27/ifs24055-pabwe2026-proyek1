import { Item } from "@/types";

export const ALL_DEPARTMENTS = "Semua Departemen";

export const sumTotalStock = (items: Item[]): number => items.reduce((sum, i) => sum + i.total_stock, 0);

export const sumAvailableStock = (items: Item[]): number => items.reduce((sum, i) => sum + i.available_stock, 0);

export function filterItems(items: Item[], department: string, search: string): Item[] {
  const query = search.trim().toLowerCase();
  return items.filter((item) => {
    const matchesDepartment = department === ALL_DEPARTMENTS || item.department_name === department;
    const matchesSearch =
      !query ||
      [item.name, item.category, item.department_name].some((field) => field.toLowerCase().includes(query));
    return matchesDepartment && matchesSearch;
  });
}
