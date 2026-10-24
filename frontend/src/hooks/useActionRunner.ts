/**
 * useActionRunner — Shared async action executor for CRUD operations.
 *
 * Provides a single `run(action)` callback that: executes the async action,
 * triggers a success toast and a data refresh on success, or shows an error
 * toast on failure. Eliminates boilerplate try/catch blocks in view components.
 */
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
