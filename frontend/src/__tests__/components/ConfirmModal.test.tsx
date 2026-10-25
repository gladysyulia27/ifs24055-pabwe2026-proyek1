import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";

describe("ConfirmModal Component", () => {
  it("renders modal with message and triggers onConfirm", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Konfirmasi Hapus Barang"
        message="Apakah Anda yakin ingin menghapus barang ini secara permanen?"
        confirmText="Ya, Hapus"
        variant="danger"
      />
    );

    expect(screen.getByText("Konfirmasi Hapus Barang")).toBeInTheDocument();
    expect(
      screen.getByText("Apakah Anda yakin ingin menghapus barang ini secara permanen?")
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Ya, Hapus" });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("renders single confirmation button in alert mode", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Pemberitahuan Sistem"
        message="Stok barang telah diperbarui."
        isAlert={true}
        confirmText="Mengerti"
      />
    );

    expect(screen.getByRole("button", { name: "Mengerti" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Batal" })).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Mengerti" }));
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Test"
        message="Not visible"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
