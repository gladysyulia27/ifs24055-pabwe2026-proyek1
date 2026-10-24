"use client";

import { useCallback } from "react";
import { getErrorMessage } from "@/utils/errors";

interface RunOptions {
  success: string;
  fallbackError: string;
  /** Re-throw so the caller (e.g. a modal) knows the action failed. */
  rethrow?: boolean;
}

/** Runs an API mutation, refreshes data afterwards and reports the outcome through toasts. */
export function useActionRunner(refresh: () => Promise<void>, showToast: (message: string) => void) {
  return useCallback(
    async (action: () => Promise<unknown>, { success, fallbackError, rethrow = false }: RunOptions) => {
      try {
        await action();
        await refresh();
        showToast(success);
      } catch (err) {
        showToast(getErrorMessage(err, fallbackError));
        if (rethrow) throw err;
      }
    },
    [refresh, showToast]
  );
}
