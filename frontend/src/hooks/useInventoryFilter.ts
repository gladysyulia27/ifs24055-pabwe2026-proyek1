import { useMemo, useState } from "react";
import { Item } from "@/types";
import { filterItems } from "@/utils/inventory";

export interface UseInventoryFilterReturn {
  search: string;
  setSearch: (query: string) => void;
  visibleItems: Item[];
  totalMatches: number;
}

/**
 * Custom hook managing search filtering and department scoping for inventory items.
 */
export function useInventoryFilter(
  items: Item[],
  departmentFilter: string,
  initialSearch = ""
): UseInventoryFilterReturn {
  const [search, setSearch] = useState(initialSearch);

  const visibleItems = useMemo(
    () => filterItems(items, departmentFilter, search),
    [items, departmentFilter, search]
  );

  return {
    search,
    setSearch,
    visibleItems,
    totalMatches: visibleItems.length
  };
}
