import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ItemCard } from "@/components/inventory/ItemCard";
import { Item, User } from "@/types";

describe("ItemCard Component (Complex UI)", () => {
  const mockItem: Item = {
    id: 1,
    department_id: 1,
    department_name: "DEPKOMINFO",
    name: "Kamera Sony Alpha 7",
    category: "Dokumentasi",
    description: "Kamera foto dan video resolusi tinggi 4K",
    total_stock: 4,
    available_stock: 3,
    condition_status: "Baik",
    image_url: "/assets/kamera.png"
  };

  const studentUser: User = {
    id: 2,
    username: "ifs24055",
    email: "student@del.ac.id",
    full_name: "Gladys Manurung",
    identifier: "11422001",
    role: "mahasiswa",
    department_id: null,
    department_name: null,
    contact_phone: "081234567890"
  };

  const sameDeptAdmin: User = {
    id: 3,
    username: "admin_kominfo",
    email: "kominfo@del.ac.id",
    full_name: "Admin Kominfo",
    identifier: "ADM-01",
    role: "admin_departemen",
    department_id: 1,
    department_name: "DEPKOMINFO",
    contact_phone: "081234567890"
  };

  const otherDeptAdmin: User = {
    id: 4,
    username: "admin_diptek",
    email: "diptek@del.ac.id",
    full_name: "Admin Diptek",
    identifier: "ADM-02",
    role: "admin_departemen",
    department_id: 2,
    department_name: "DIPTEK",
    contact_phone: "081234567890"
  };

  it("renders item details, stock quantity, and availability status", () => {
    render(
      <ItemCard
        item={mockItem}
        currentUser={studentUser}
        onBorrow={vi.fn()}
      />
    );

    expect(screen.getByText("Kamera Sony Alpha 7")).toBeInTheDocument();
    expect(screen.getByText("Dokumentasi")).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 4 unit/i)).toBeInTheDocument();
    expect(screen.getByText("Tersedia")).toBeInTheDocument();
  });

  it("renders borrow button for students and calls onBorrow", () => {
    const onBorrow = vi.fn();
    render(
      <ItemCard
        item={mockItem}
        currentUser={studentUser}
        onBorrow={onBorrow}
      />
    );

    const borrowBtn = screen.getByRole("button", { name: /ajukan peminjaman/i });
    expect(borrowBtn).toBeEnabled();
    fireEvent.click(borrowBtn);
    expect(onBorrow).toHaveBeenCalledWith(mockItem);
  });

  it("disables borrow button when item is out of stock", () => {
    const outOfStockItem: Item = {
      ...mockItem,
      available_stock: 0
    };

    render(
      <ItemCard
        item={outOfStockItem}
        currentUser={studentUser}
        onBorrow={vi.fn()}
      />
    );

    const disabledBtn = screen.getByRole("button", { name: /stok habis/i });
    expect(disabledBtn).toBeDisabled();
    expect(screen.getByText("Habis")).toBeInTheDocument();
  });

  it("renders Edit and Delete actions for the managing department admin", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ItemCard
        item={mockItem}
        currentUser={sameDeptAdmin}
        onBorrow={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const editBtn = screen.getByRole("button", { name: /edit/i });
    const deleteBtn = screen.getByTitle("Hapus Barang");

    expect(editBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(mockItem);

    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(mockItem);
  });

  it("renders foreign department note when viewed by another department's admin", () => {
    render(
      <ItemCard
        item={mockItem}
        currentUser={otherDeptAdmin}
        onBorrow={vi.fn()}
      />
    );

    expect(
      screen.getByText("Dikelola oleh Departemen DEPKOMINFO")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
  });
});
