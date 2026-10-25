import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function ProblematicComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Gagal merender data tabel!");
  }
  return <div>Konten Berhasil Dimuat</div>;
}

describe("ErrorBoundary Component", () => {
  it("renders children normally when no exception occurs", () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Konten Berhasil Dimuat")).toBeInTheDocument();
  });

  it("catches errors and renders fallback error card", () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Terjadi Kendala Tampilan")).toBeInTheDocument();
    expect(screen.getByText("Gagal merender data tabel!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /muat ulang halaman/i })
    ).toBeInTheDocument();
  });
});
