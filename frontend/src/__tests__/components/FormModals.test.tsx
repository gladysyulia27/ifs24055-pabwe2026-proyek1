import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { LoanModal } from "@/components/loans/LoanModal";
import { ItemModal } from "@/components/inventory/ItemModal";
import { Item, User } from "@/types";

const mockUser: User = {
  id: 1,
  username: "ifs24055",
  email: "ifs24055@del.ac.id",
  full_name: "Gladys Manurung",
  identifier: "11422001",
  role: "admin_departemen",
  department_id: 1,
  department_name: "Departemen Sarana & Prasarana",
  contact_phone: "08123456789",
  created_at: "2026-10-01T00:00:00Z"
};

const mockItem: Item = {
  id: 10,
  department_id: 1,
  department_name: "Departemen Sarana & Prasarana",
  name: "Kamera Sony Alpha A7 III",
  category: "Dokumentasi",
  description: "Kamera mirrorless full-frame",
  total_stock: 3,
  available_stock: 2,
  condition_status: "Baik",
  image_url: ""
};

describe("Modal Forms (Complex UI Components)", () => {
  describe("LoanModal", () => {
    it("renders initial form with item summary and default values", () => {
      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onErrorToast = vi.fn();

      render(
        <LoanModal
          item={mockItem}
          currentUser={mockUser}
          onClose={onClose}
          onSubmit={onSubmit}
          onErrorToast={onErrorToast}
        />
      );

      expect(screen.getByText("Formulir Pengajuan Peminjaman")).toBeInTheDocument();
      expect(screen.getByText("Kamera Sony Alpha A7 III")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Gladys Manurung")).toBeInTheDocument();
      expect(screen.getByDisplayValue("11422001")).toBeInTheDocument();
    });

    it("validates empty purpose before calling onSubmit", async () => {
      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onErrorToast = vi.fn();

      render(
        <LoanModal
          item={mockItem}
          currentUser={mockUser}
          onClose={onClose}
          onSubmit={onSubmit}
          onErrorToast={onErrorToast}
        />
      );

      const submitButton = screen.getByRole("button", { name: /kirim pengajuan/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Tujuan peminjaman wajib diisi.")).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("ItemModal", () => {
    it("renders add item form with current department context", () => {
      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onErrorToast = vi.fn();

      render(
        <ItemModal
          editingItem={null}
          currentUser={mockUser}
          onClose={onClose}
          onSubmit={onSubmit}
          onErrorToast={onErrorToast}
        />
      );

      expect(screen.getByText(/Tambah Inventori Departemen Sarana & Prasarana/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("Departemen Sarana & Prasarana")).toBeInTheDocument();
    });

    it("pre-fills inputs when editing an existing item", () => {
      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onErrorToast = vi.fn();

      render(
        <ItemModal
          editingItem={mockItem}
          currentUser={mockUser}
          onClose={onClose}
          onSubmit={onSubmit}
          onErrorToast={onErrorToast}
        />
      );

      expect(screen.getByText("Edit Inventori")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Kamera Sony Alpha A7 III")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Dokumentasi")).toBeInTheDocument();
    });
  });
});
