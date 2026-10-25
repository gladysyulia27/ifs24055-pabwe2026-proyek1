import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Department, Item, Loan } from "@/types";

describe("useDashboardStats hook", () => {
  const departments: Department[] = [
    { id: 1, name: "DEPKOMINFO", contact_name: "", contact_email: "", contact_phone: "", inventory_count: 1 },
    { id: 2, name: "DIPTEK", contact_name: "", contact_email: "", contact_phone: "", inventory_count: 1 }
  ];

  const items: Item[] = [
    {
      id: 1,
      department_id: 1,
      department_name: "DEPKOMINFO",
      name: "Kamera",
      category: "Kamera",
      description: "",
      total_stock: 10,
      available_stock: 6,
      condition_status: "Baik"
    },
    {
      id: 2,
      department_id: 2,
      department_name: "DIPTEK",
      name: "Router",
      category: "Jaringan",
      description: "",
      total_stock: 4,
      available_stock: 4,
      condition_status: "Baik"
    }
  ];

  const loans: Loan[] = [
    {
      id: 1,
      inventory_id: 1,
      inventory_name: "Kamera",
      department_name: "DEPKOMINFO",
      borrower_name: "Gladys",
      borrower_id: "11422001",
      borrower_contact: "",
      organization: "BEM",
      purpose: "Raker",
      quantity: 4,
      start_date: "2026-10-25",
      due_date: "2026-10-27",
      status: "Disetujui",
      return_proof_url: "",
      created_at: "2026-10-24"
    },
    {
      id: 2,
      inventory_id: 1,
      inventory_name: "Kamera",
      department_name: "DEPKOMINFO",
      borrower_name: "Budi",
      borrower_id: "11422002",
      borrower_contact: "",
      organization: "HMP",
      purpose: "Seminar",
      quantity: 1,
      start_date: "2026-10-26",
      due_date: "2026-10-28",
      status: "Menunggu Approval",
      return_proof_url: "",
      created_at: "2026-10-24"
    }
  ];

  it("calculates inventory metrics and totals correctly", () => {
    const { result } = renderHook(() =>
      useDashboardStats(departments, items, loans)
    );

    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalStockUnits).toBe(14); // 10 + 4
    expect(result.current.availableStockUnits).toBe(10); // 6 + 4
    expect(result.current.activeLoansCount).toBe(1);
    expect(result.current.activeBorrowedUnits).toBe(4);
    expect(result.current.pendingApprovalCount).toBe(1);
  });

  it("breaks down item counts per department", () => {
    const { result } = renderHook(() =>
      useDashboardStats(departments, items, loans)
    );

    const kominfo = result.current.departmentSummaries.find((d) => d.id === 1);
    const diptek = result.current.departmentSummaries.find((d) => d.id === 2);

    expect(kominfo?.itemCount).toBe(1);
    expect(kominfo?.totalUnits).toBe(10);
    expect(diptek?.itemCount).toBe(1);
    expect(diptek?.totalUnits).toBe(4);
  });

  it("handles loans with missing or invalid quantity gracefully", () => {
    const invalidQtyLoans: Loan[] = [
      {
        ...loans[0],
        quantity: 0
      } as Loan
    ];
    const { result } = renderHook(() =>
      useDashboardStats(departments, items, invalidQtyLoans)
    );
    expect(result.current.activeBorrowedUnits).toBe(0);
  });
});
