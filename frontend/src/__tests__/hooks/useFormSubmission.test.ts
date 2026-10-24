import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormSubmission } from "@/hooks/useFormSubmission";

describe("useFormSubmission hook", () => {
  it("handles successful form submission workflow", async () => {
    const onClose = vi.fn();
    const onErrorToast = vi.fn();
    const action = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useFormSubmission({ onClose, onErrorToast })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.submit(null, action);
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onErrorToast).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("handles validation errors and aborts action call", async () => {
    const onClose = vi.fn();
    const onErrorToast = vi.fn();
    const action = vi.fn();

    const { result } = renderHook(() =>
      useFormSubmission({ onClose, onErrorToast })
    );

    await act(async () => {
      await result.current.submit("Kolom nama wajib diisi.", action);
    });

    expect(action).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(onErrorToast).toHaveBeenCalledWith("Kolom nama wajib diisi.");
    expect(result.current.error).toBe("Kolom nama wajib diisi.");
    expect(result.current.loading).toBe(false);
  });

  it("keeps modal open when async action rejects", async () => {
    const onClose = vi.fn();
    const onErrorToast = vi.fn();
    const action = vi.fn().mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() =>
      useFormSubmission({ onClose, onErrorToast })
    );

    await act(async () => {
      await result.current.submit(null, action);
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
