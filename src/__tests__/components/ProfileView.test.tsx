import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ProfileView } from "@/components/views/ProfileView";
import { User, Loan } from "@/types";

describe("ProfileView Component (Complex UI)", () => {
  const studentUser: User = {
    id: 10,
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
    id: 20,
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
      id: 1,
      inventory_id: 10,
      inventory_name: "Kamera",
      department_name: "DEPKOMINFO",
      borrower_name: "Gladys",
      borrower_id: "IFS24055",
      borrower_contact: "08123",
      organization: "BEM IT Del",
      purpose: "Dokumentasi",
      quantity: 1,
      start_date: "2026-10-01",
      due_date: "2026-10-07",
      status: "Dikembalikan",
      return_proof_url: "",
      created_at: "2026-10-01T00:00:00Z"
    },
    {
      id: 2,
      inventory_id: 11,
      inventory_name: "Raket",
      department_name: "DESARPRAS",
      borrower_name: "Gladys",
      borrower_id: "IFS24055",
      borrower_contact: "08123",
      organization: "BEM IT Del",
      purpose: "Olahraga",
      quantity: 2,
      start_date: "2026-10-10",
      due_date: "2026-10-14",
      status: "Disetujui",
      return_proof_url: "",
      created_at: "2026-10-10T00:00:00Z"
    }
  ];

  it("renders student full name and identifier", () => {
    render(<ProfileView user={studentUser} userLoans={[]} onBack={vi.fn()} onLogout={vi.fn()} />);
    expect(screen.getByText("Gladys Yulia Stephanie Manurung")).toBeInTheDocument();
    expect(screen.getByText("IFS24055")).toBeInTheDocument();
  });

  it("shows 'Mahasiswa / Peminjam' role label for students", () => {
    render(<ProfileView user={studentUser} userLoans={[]} onBack={vi.fn()} onLogout={vi.fn()} />);
    expect(screen.getByText("Mahasiswa / Peminjam")).toBeInTheDocument();
  });

  it("shows admin department label for department admins", () => {
    render(<ProfileView user={adminUser} userLoans={[]} onBack={vi.fn()} onLogout={vi.fn()} />);
    expect(screen.getByText(/Admin Departemen DEPKOMINFO/)).toBeInTheDocument();
  });

  it("shows managed department info row for admins", () => {
    render(<ProfileView user={adminUser} userLoans={[]} onBack={vi.fn()} onLogout={vi.fn()} />);
    expect(screen.getByText("Departemen yang Dikelola")).toBeInTheDocument();
    expect(screen.getByText("Departemen DEPKOMINFO")).toBeInTheDocument();
  });

  it("does NOT show managed department row for students", () => {
    render(<ProfileView user={studentUser} userLoans={[]} onBack={vi.fn()} onLogout={vi.fn()} />);
    expect(screen.queryByText("Departemen yang Dikelola")).not.toBeInTheDocument();
  });

  it("displays the correct loan transaction count", () => {
    render(<ProfileView user={studentUser} userLoans={loans} onBack={vi.fn()} onLogout={vi.fn()} />);
    // The transaction count appears inside a sentence:
    // "Total 2 transaksi peminjaman tercatat pada akun ini."
    expect(screen.getByText(/transaksi peminjaman tercatat/)).toBeInTheDocument();

  });

  it("calls onLogout when the logout button is clicked", () => {
    const onLogout = vi.fn();
    render(<ProfileView user={studentUser} userLoans={[]} onBack={vi.fn()} onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button", { name: /Keluar dari Akun/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("calls onBack when the back button is clicked", () => {
    const onBack = vi.fn();
    render(<ProfileView user={studentUser} userLoans={[]} onBack={onBack} onLogout={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /kembali/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
