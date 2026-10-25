import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DashboardView } from "@/components/views/DashboardView";
import { Department, Item, Loan } from "@/types";

describe("DashboardView Component (Complex UI)", () => {
  const departments: Department[] = [
    {
      id: 1,
      name: "DEPKOMINFO",
      contact_name: "Gladys",
      contact_email: "kominfo@del.ac.id",
      contact_phone: "081234567890",
      inventory_count: 2
    },
    {
      id: 2,
      name: "DESARPRAS",
      contact_name: "Budi",
      contact_email: "sarpras@del.ac.id",
      contact_phone: "081234567891",
      inventory_count: 1
    }
  ];

  const items: Item[] = [
    {
      id: 1,
      department_id: 1,
      department_name: "DEPKOMINFO",
      name: "Kamera Sony",
      category: "Kamera",
      description: "Kamera video",
      total_stock: 5,
      available_stock: 3,
      condition_status: "Baik"
    },
    {
      id: 2,
      department_id: 2,
      department_name: "DESARPRAS",
      name: "Sound System Portable",
      category: "Audio",
      description: "Speaker aktif",
      total_stock: 2,
      available_stock: 2,
      condition_status: "Baik"
    }
  ];

  const loans: Loan[] = [
    {
      id: 101,
      inventory_id: 1,
      inventory_name: "Kamera Sony",
      department_name: "DEPKOMINFO",
      borrower_name: "Gladys Manurung",
      borrower_id: "11422001",
      borrower_contact: "081234567890",
      organization: "BEM",
      purpose: "Liputan Acara",
      quantity: 2,
      start_date: "2026-10-25",
      due_date: "2026-10-27",
      status: "Disetujui",
      return_proof_url: "",
      created_at: "2026-10-24"
    },
    {
      id: 102,
      inventory_id: 2,
      inventory_name: "Sound System Portable",
      department_name: "DESARPRAS",
      borrower_name: "Rian Sitompul",
      borrower_id: "11422002",
      borrower_contact: "081234567892",
      organization: "Paduan Suara",
      purpose: "Latihan Rutin",
      quantity: 1,
      start_date: "2026-10-26",
      due_date: "2026-10-28",
      status: "Menunggu Approval",
      return_proof_url: "",
      created_at: "2026-10-24"
    }
  ];

  it("renders dashboard header and CTA button", () => {
    const onNavigate = vi.fn();
    render(
      <DashboardView
        departments={departments}
        items={items}
        loans={loans}
        loading={false}
        onNavigate={onNavigate}
        onSelectDepartment={vi.fn()}
      />
    );

    expect(screen.getByText("Dashboard Inventori")).toBeInTheDocument();
    const ctaBtn = screen.getByRole("button", { name: /jelajahi inventori/i });
    fireEvent.click(ctaBtn);
    expect(onNavigate).toHaveBeenCalledWith("Inventori");
  });

  it("calculates and displays aggregated inventory statistics accurately", () => {
    render(
      <DashboardView
        departments={departments}
        items={items}
        loans={loans}
        loading={false}
        onNavigate={vi.fn()}
        onSelectDepartment={vi.fn()}
      />
    );

    // Total stock: 5 + 2 = 7 units
    expect(screen.getByText("Total Inventori")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    // Active borrowed: 2 units (loan 101)
    expect(screen.getByText("Sedang Dipinjam")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    // Available stock: 3 + 2 = 5 units
    expect(screen.getByText("Barang Tersedia")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    // Pending approval: 1 transaction (loan 102)
    // "Menunggu Approval" appears in stat card and in loan activity, so use getAllByText
    const pendingEls = screen.getAllByText("Menunggu Approval");
    expect(pendingEls.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders department list and triggers onSelectDepartment upon clicking", () => {
    const onSelectDepartment = vi.fn();
    render(
      <DashboardView
        departments={departments}
        items={items}
        loans={loans}
        loading={false}
        onNavigate={vi.fn()}
        onSelectDepartment={onSelectDepartment}
      />
    );

    expect(screen.getByText("Inventori per Departemen")).toBeInTheDocument();
    const deptRow = screen.getByText("DEPKOMINFO");
    fireEvent.click(deptRow);
    expect(onSelectDepartment).toHaveBeenCalledWith("DEPKOMINFO");
  });

  it("renders recent loan activities and statuses", () => {
    render(
      <DashboardView
        departments={departments}
        items={items}
        loans={loans}
        loading={false}
        onNavigate={vi.fn()}
        onSelectDepartment={vi.fn()}
      />
    );

    expect(screen.getByText("Aktivitas Terbaru")).toBeInTheDocument();
    expect(screen.getByText("Gladys Manurung")).toBeInTheDocument();
    expect(screen.getByText("Rian Sitompul")).toBeInTheDocument();
  });
});
