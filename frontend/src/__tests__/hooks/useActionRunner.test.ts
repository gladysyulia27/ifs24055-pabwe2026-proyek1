import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActionRunner } from "@/hooks/useActionRunner";

describe("useActionRunner hook", () => {
  it("runs action successfully, refreshes data and fires success toast", async () => {
    const refresh = vi.fn().mockResolvedValue(undefined);
    const showToast = vi.fn();
    const action = vi.fn().mockResolvedValue({ success: true });

    const { result } = renderHook(() => useActionRunner(refresh, showToast));

    await act(async () => {
      await result.current(action, {
        success: "Barang berhasil disimpan!",
        fallbackError: "Gagal menyimpan barang"
      });
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(showToast).toHaveBeenCalledWith("Barang berhasil disimpan!");
  });

  it("handles errors gracefully with toast and fallback message", async () => {
    const refresh = vi.fn();
    const showToast = vi.fn();
    const action = vi.fn().mockRejectedValue(new Error("Stok tidak mencukupi"));

    const { result } = renderHook(() => useActionRunner(refresh, showToast));

    await act(async () => {
      await result.current(action, {
        success: "Berhasil",
        fallbackError: "Gagal memproses aksi",
        rethrow: false
      });
    });

    expect(showToast).toHaveBeenCalledWith("Stok tidak mencukupi");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("rethrows error when rethrow option is true", async () => {
    const refresh = vi.fn();
    const showToast = vi.fn();
    const action = vi.fn().mockRejectedValue(new Error("Fatal error"));

    const { result } = renderHook(() => useActionRunner(refresh, showToast));

    let caught: unknown;
    await act(async () => {
      try {
        await result.current(action, {
          success: "Berhasil",
          fallbackError: "Gagal",
          rethrow: true
        });
      } catch (err) {
        caught = err;
      }
    });

    expect(caught).toBeInstanceOf(Error);
    expect(showToast).toHaveBeenCalledWith("Fatal error");
  });
});
