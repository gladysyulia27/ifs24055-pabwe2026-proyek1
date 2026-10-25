import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { InventoryView } from "@/components/views/InventoryView";
import { Department, Item, User } from "@/types";

describe("InventoryView Component (Complex UI)", () => {
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
      name: "DIPTEK",
      contact_name: "Budi",
      contact_email: "diptek@del.ac.id",
      contact_phone: "081234567891",
      inventory_count: 1
    }
  ];

  const items: Item[] = [
    {
      id: 1,
      department_id: 1,
      department_name: "DEPKOMINFO",
      name: "Kamera Sony Alpha",
      category: "Kamera",
      description: "Kamera 4K",
      total_stock: 4,
      available_stock: 2,
      condition_status: "Baik"
    },
    {
      id: 2,
      department_id: 2,
      department_name: "DIPTEK",
      name: "Arduino Starter Kit",
      category: "Mikrokontroler",
      description: "Kit robotika",
      total_stock: 10,
      available_stock: 8,
      condition_status: "Baik"
    }
  ];

  const studentUser: User = {
    id: 1,
    username: "ifs24055",
    email: "student@del.ac.id",
    full_name: "Gladys Manurung",
    identifier: "11422001",
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
    identifier: "ADM-01",
    role: "admin_departemen",
    department_id: 1,
    department_name: "DEPKOMINFO",
    contact_phone: "081234567890"
  };

  it("renders catalog items and search count badge", () => {
    render(
      <InventoryView
        user={studentUser}
        departments={departments}
        items={items}
        loading={false}
        departmentFilter="Semua Departemen"
        onDepartmentFilterChange={vi.fn()}
        onBack={vi.fn()}
        onBorrow={vi.fn()}
        onAddItem={vi.fn()}
        onEditItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    expect(screen.getByText("Inventori Departemen")).toBeInTheDocument();
    expect(screen.getByText("2 barang")).toBeInTheDocument();
    expect(screen.getByText("Kamera Sony Alpha")).toBeInTheDocument();
    expect(screen.getByText("Arduino Starter Kit")).toBeInTheDocument();
  });

  it("filters items interactively through search input", () => {
    render(
      <InventoryView
        user={studentUser}
        departments={departments}
        items={items}
        loading={false}
        departmentFilter="Semua Departemen"
        onDepartmentFilterChange={vi.fn()}
        onBack={vi.fn()}
        onBorrow={vi.fn()}
        onAddItem={vi.fn()}
        onEditItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/cari nama barang/i);
    fireEvent.change(searchInput, { target: { value: "Arduino" } });

    expect(screen.getByText("Arduino Starter Kit")).toBeInTheDocument();
    expect(screen.queryByText("Kamera Sony Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("1 barang")).toBeInTheDocument();
  });

  it("renders Add Item button for department admin but not for student", () => {
    const onAddItem = vi.fn();
    const { rerender } = render(
      <InventoryView
        user={adminUser}
        departments={departments}
        items={items}
        loading={false}
        departmentFilter="Semua Departemen"
        onDepartmentFilterChange={vi.fn()}
        onBack={vi.fn()}
        onBorrow={vi.fn()}
        onAddItem={onAddItem}
        onEditItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const addBtn = screen.getByRole("button", { name: /tambah inventori depkominfo/i });
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn);
    expect(onAddItem).toHaveBeenCalledTimes(1);

    rerender(
      <InventoryView
        user={studentUser}
        departments={departments}
        items={items}
        loading={false}
        departmentFilter="Semua Departemen"
        onDepartmentFilterChange={vi.fn()}
        onBack={vi.fn()}
        onBorrow={vi.fn()}
        onAddItem={onAddItem}
        onEditItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    expect(screen.queryByRole("button", { name: /tambah inventori/i })).not.toBeInTheDocument();
  });

  it("displays empty state when search produces no matches", () => {
    render(
      <InventoryView
        user={studentUser}
        departments={departments}
        items={items}
        loading={false}
        departmentFilter="Semua Departemen"
        onDepartmentFilterChange={vi.fn()}
        onBack={vi.fn()}
        onBorrow={vi.fn()}
        onAddItem={vi.fn()}
        onEditItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/cari nama barang/i);
    fireEvent.change(searchInput, { target: { value: "Drone" } });

    expect(
      screen.getByText("Tidak ada barang yang cocok dengan kriteria pencarian.")
    ).toBeInTheDocument();
  });
});
