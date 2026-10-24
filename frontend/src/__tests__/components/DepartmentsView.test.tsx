import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DepartmentsView } from "@/components/views/DepartmentsView";
import { Department, Item, User } from "@/types";

const mockUser: User = {
  id: 1,
  username: "ifs24055",
  email: "ifs24055@del.ac.id",
  full_name: "Gladys Manurung",
  identifier: "11422001",
  role: "admin_departemen",
  department_id: 1,
  department_name: "DEPKOMINFO",
  contact_phone: "08123456789",
  created_at: "2026-10-01T00:00:00Z"
};

const mockDepartments: Department[] = [
  {
    id: 1,
    name: "DEPKOMINFO",
    contact_name: "Penanggung Jawab DEPKOMINFO",
    contact_email: "kominfo@del.ac.id",
    contact_phone: "0811111111",
    inventory_count: 2
  },
  {
    id: 2,
    name: "DESARPRAS",
    contact_name: "Penanggung Jawab DESARPRAS",
    contact_email: "sarpras@del.ac.id",
    contact_phone: "0822222222",
    inventory_count: 1
  }
];

const mockItems: Item[] = [
  {
    id: 101,
    department_id: 1,
    department_name: "DEPKOMINFO",
    name: "Kamera Sony Alpha A7 III",
    category: "Dokumentasi",
    description: "Kamera mirrorless",
    total_stock: 2,
    available_stock: 2,
    condition_status: "Baik",
    image_url: ""
  },
  {
    id: 102,
    department_id: 1,
    department_name: "DEPKOMINFO",
    name: "Microphone Wireless Rode",
    category: "Audio",
    description: "Mic clip on",
    total_stock: 4,
    available_stock: 3,
    condition_status: "Baik",
    image_url: ""
  },
  {
    id: 103,
    department_id: 2,
    department_name: "DESARPRAS",
    name: "Sound System Portable",
    category: "Audio",
    description: "Speaker aktif",
    total_stock: 1,
    available_stock: 1,
    condition_status: "Baik",
    image_url: ""
  }
];

describe("DepartmentsView Component", () => {
  it("renders page header and all department cards", () => {
    const onBack = vi.fn();
    const onSelectDepartment = vi.fn();

    render(
      <DepartmentsView
        user={mockUser}
        departments={mockDepartments}
        items={mockItems}
        onBack={onBack}
        onSelectDepartment={onSelectDepartment}
      />
    );

    expect(screen.getByText("Departemen BEM IT Del")).toBeInTheDocument();
    expect(screen.getAllByText(/DEPKOMINFO/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DESARPRAS/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/(Dikelola Anda)/i)).toBeInTheDocument();
  });

  it("calculates and displays total stock per department correctly", () => {
    render(
      <DepartmentsView
        user={mockUser}
        departments={mockDepartments}
        items={mockItems}
        onBack={vi.fn()}
        onSelectDepartment={vi.fn()}
      />
    );

    // DEPKOMINFO has 2 items with total_stock 2 + 4 = 6
    expect(screen.getByText(/2 jenis barang · 6 unit total/i)).toBeInTheDocument();
    // DESARPRAS has 1 item with total_stock 1 = 1
    expect(screen.getByText(/1 jenis barang · 1 unit total/i)).toBeInTheDocument();
  });

  it("calls onSelectDepartment when clicking View Inventory button", () => {
    const onSelectDepartment = vi.fn();

    render(
      <DepartmentsView
        user={mockUser}
        departments={mockDepartments}
        items={mockItems}
        onBack={vi.fn()}
        onSelectDepartment={onSelectDepartment}
      />
    );

    const actionButtons = screen.getAllByRole("button", { name: /lihat inventori/i });
    fireEvent.click(actionButtons[0]);

    expect(onSelectDepartment).toHaveBeenCalledWith("DEPKOMINFO");
  });
});
