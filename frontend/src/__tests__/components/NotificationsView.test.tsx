import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { NotificationsView } from "@/components/views/NotificationsView";
import { User, NotificationsData } from "@/types";

describe("NotificationsView Component (Complex UI)", () => {
  const studentUser: User = {
    id: 1,
    username: "gladys27",
    email: "gladys@student.del.ac.id",
    full_name: "Gladys Yulia",
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
    full_name: "Admin Kominfo",
    identifier: "KMF001",
    role: "admin_departemen",
    department_id: 1,
    department_name: "DEPKOMINFO",
    contact_phone: "081299998888"
  };

  const emptyNotifications: NotificationsData = { pending: [], due_returns: [] };

  const filledNotifications: NotificationsData = {
    pending: [
      {
        id: 10,
        borrower_name: "Budi Santoso",
        inventory_name: "Kamera Canon",
        department_name: "DEPKOMINFO",
        due_date: "2026-10-30"
      }
    ],
    due_returns: [
      {
        id: 20,
        borrower_name: "Sari Dewi",
        inventory_name: "Raket Badminton",
        department_name: "DESARPRAS",
        due_date: "2026-10-25"
      }
    ]
  };

  it("renders heading without department name for student users", () => {
    render(
      <NotificationsView user={studentUser} notifications={emptyNotifications} onBack={vi.fn()} />
    );
    expect(screen.getByText("Notifikasi")).toBeInTheDocument();
    // Should NOT mention a department
    expect(screen.queryByText(/Departemen/)).not.toBeInTheDocument();
  });

  it("renders heading including department name for admin users", () => {
    render(
      <NotificationsView user={adminUser} notifications={emptyNotifications} onBack={vi.fn()} />
    );
    expect(screen.getByText(/Departemen DEPKOMINFO/)).toBeInTheDocument();
  });

  it("shows empty-state messages when both lists are empty", () => {
    render(
      <NotificationsView user={studentUser} notifications={emptyNotifications} onBack={vi.fn()} />
    );
    expect(screen.getByText("Tidak ada pemberitahuan baru.")).toBeInTheDocument();
    expect(screen.getByText("Tidak ada barang yang mendekati jatuh tempo.")).toBeInTheDocument();
  });

  it("renders pending notice with inventory name and borrower", () => {
    render(
      <NotificationsView user={adminUser} notifications={filledNotifications} onBack={vi.fn()} />
    );
    expect(screen.getByText("Kamera Canon")).toBeInTheDocument();
    expect(screen.getByText(/Budi Santoso/)).toBeInTheDocument();
  });

  it("renders due-return notice with inventory name and due date", () => {
    render(
      <NotificationsView user={adminUser} notifications={filledNotifications} onBack={vi.fn()} />
    );
    expect(screen.getByText("Raket Badminton")).toBeInTheDocument();
    expect(screen.getByText(/2026-10-25/)).toBeInTheDocument();
  });

  it("shows panel titles: 'Perlu ditindaklanjuti' and 'Pengingat pengembalian'", () => {
    render(
      <NotificationsView user={studentUser} notifications={emptyNotifications} onBack={vi.fn()} />
    );
    expect(screen.getByText("Perlu ditindaklanjuti")).toBeInTheDocument();
    expect(screen.getByText("Pengingat pengembalian")).toBeInTheDocument();
  });
});
