import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { PageHeader } from "@/components/common/PageHeader";

describe("PageHeader Component", () => {
  it("renders titles, subtitle, and eyebrow correctly", () => {
    render(
      <PageHeader
        eyebrow="MODUL INVENTORI"
        title="Daftar Logistik BEM"
        description="Kelola seluruh perlengkapan kegiatan kampus"
      />
    );

    expect(screen.getByText("MODUL INVENTORI")).toBeInTheDocument();
    expect(screen.getByText("Daftar Logistik BEM")).toBeInTheDocument();
    expect(screen.getByText("Kelola seluruh perlengkapan kegiatan kampus")).toBeInTheDocument();
  });

  it("renders back button and triggers onBack handler", () => {
    const onBack = vi.fn();
    render(
      <PageHeader
        eyebrow="DETAIL"
        title="Detail Peminjaman"
        description="Informasi peminjaman barang"
        onBack={onBack}
      />
    );

    const backButton = screen.getByRole("button", { name: /kembali ke dashboard/i });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders custom actions inside the header", () => {
    render(
      <PageHeader
        eyebrow="KATALOG"
        title="Katalog"
        description="Daftar inventori"
        actions={<button type="button">Tambah Barang Baru</button>}
      />
    );

    expect(screen.getByRole("button", { name: "Tambah Barang Baru" })).toBeInTheDocument();
  });
});
