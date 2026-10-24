import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { LoansView } from "@/components/views/LoansView";
import { User, Loan } from "@/types";

describe("LoansView Component (Complex UI)", () => {
  const studentUser: User = {
    id: 1,
    username: "gladys27",
    email: "gladys@student.del.ac.id",
    full_name: "Gladys Yulia Stephanie Manurung",
    identifier: "IFS24055",
    role: "mahasiswa",
    department_id: null,
    department_name: null,
    contact_phone: "081234567890"
  };

  const adminUser: User = {
    id: 2,
    username: "admin_kominfo",
    email: "kominfo@del.ac.id",
    full_name: "Admin DEPKOMINFO",
    identifier: "KMF001",
    role: "admin_departemen",
    department_id: 1,
    department_name: "DEPKOMINFO",
    contact_phone: "081299998888"
  };

  const loans: Loan[] = [
    {
      id: 101,
      inventory_id: 5,
      inventory_name: "Kamera Canon",
      department_name: "DEPKOMINFO",
      borrower_name: "Gladys Yulia",
      borrower_id: "IFS24055",
      borrower_contact: "08123",
      organization: "BEM IT Del",
      purpose: "Dokumentasi acara",
      quantity: 1,
      start_date: "2026-10-01",
      due_date: "2026-10-07",
      status: "Menunggu Approval",
      return_proof_url: "",
      created_at: "2026-10-01T00:00:00Z"
    }
  ];

  const defaultProps = {
    loading: false,
    onBack: vi.fn(),
    onOpenCalendar: vi.fn(),
    onAction: vi.fn(),
    onOpenReturn: vi.fn()
  };

  it("renders 'Peminjaman Saya' title and STATUS eyebrow for students", () => {
    render(<LoansView {...defaultProps} user={studentUser} loans={[]} />);
    expect(screen.getByText("Peminjaman Saya")).toBeInTheDocument();
    expect(screen.getByText(/STATUS PEMINJAMAN/)).toBeInTheDocument();
  });

  it("renders department-scoped title and PANEL PERSETUJUAN eyebrow for admins", () => {
    render(<LoansView {...defaultProps} user={adminUser} loans={[]} />);
    expect(screen.getByText(/Persetujuan Peminjaman Departemen DEPKOMINFO/)).toBeInTheDocument();
    expect(screen.getByText(/PANEL PERSETUJUAN/)).toBeInTheDocument();
  });

  it("shows empty state when no loans exist", () => {
    render(<LoansView {...defaultProps} user={studentUser} loans={[]} />);
    expect(screen.getByText(/Belum ada transaksi peminjaman/)).toBeInTheDocument();
  });

  it("renders loan table headers when loans are present", () => {
    render(<LoansView {...defaultProps} user={studentUser} loans={loans} />);
    expect(screen.getByText("Barang")).toBeInTheDocument();
    expect(screen.getByText("Peminjam")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders loan row data: inventory name and borrower name", () => {
    render(<LoansView {...defaultProps} user={studentUser} loans={loans} />);
    expect(screen.getByText("Kamera Canon")).toBeInTheDocument();
    expect(screen.getByText("Gladys Yulia")).toBeInTheDocument();
  });

  it("calls onOpenCalendar when the calendar button is clicked", () => {
    const onOpenCalendar = vi.fn();
    render(
      <LoansView {...defaultProps} user={studentUser} loans={[]} onOpenCalendar={onOpenCalendar} />
    );
    fireEvent.click(screen.getByRole("button", { name: /kalender/i }));
    expect(onOpenCalendar).toHaveBeenCalledTimes(1);
  });

  it("calls onBack when the back button is clicked", () => {
    const onBack = vi.fn();
    render(<LoansView {...defaultProps} user={studentUser} loans={[]} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /kembali/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
