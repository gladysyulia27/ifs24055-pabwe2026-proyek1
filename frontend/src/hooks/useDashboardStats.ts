import { useMemo } from "react";
import { Department, Item, Loan } from "@/types";
import { sumAvailableStock, sumTotalStock } from "@/utils/inventory";
import { isActiveLoan, isPendingLoan } from "@/utils/loans";

export interface DepartmentSummaryItem {
  id: number;
  name: string;
  itemCount: number;
  totalUnits: number;
}

export interface DashboardComputedStats {
  totalItems: number;
  totalStockUnits: number;
  activeLoansCount: number;
  activeBorrowedUnits: number;
  availableStockUnits: number;
  pendingApprovalCount: number;
  departmentSummaries: DepartmentSummaryItem[];
}

/**
 * Custom hook isolating aggregation, calculation, and grouping logic for the dashboard.
 */
export function useDashboardStats(
  departments: Department[],
  items: Item[],
  loans: Loan[]
): DashboardComputedStats {
  return useMemo(() => {
    const activeLoans = loans.filter(isActiveLoan);
    const pendingLoans = loans.filter(isPendingLoan);

    const totalStockUnits = sumTotalStock(items);
    const availableStockUnits = sumAvailableStock(items);
    const activeBorrowedUnits = activeLoans.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0);

    const departmentSummaries = departments.map((dept) => {
      const deptItems = items.filter((i) => i.department_id === dept.id);
      return {
        id: dept.id,
        name: dept.name,
        itemCount: deptItems.length,
        totalUnits: sumTotalStock(deptItems)
      };
    });

    return {
      totalItems: items.length,
      totalStockUnits,
      activeLoansCount: activeLoans.length,
      activeBorrowedUnits,
      availableStockUnits,
      pendingApprovalCount: pendingLoans.length,
      departmentSummaries
    };
  }, [departments, items, loans]);
}
