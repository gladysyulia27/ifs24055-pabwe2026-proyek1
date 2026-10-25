/**
 * useFormSubmission — Reusable form-submission state manager.
 *
 * Tracks `submitting` state and orchestrates the submit lifecycle:
 * validates data, calls an async handler, then invokes onClose on success
 * or shows an error toast on failure. Used by ItemModal and LoanModal.
 */
"use client";

import { useState } from "react";

interface Options {
  onClose: () => void;
  onErrorToast: (message: string) => void;
}

/**
 * Shared submit lifecycle for modal forms: validation error display, loading flag,
 * and closing the modal once the action succeeds. When the action rejects, the modal
 * stays open (the caller is responsible for reporting the failure).
 */
export function useFormSubmission({ onClose, onErrorToast }: Options) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (validationError: string | null, action: () => Promise<void>) => {
    if (validationError) {
      setError(validationError);
      onErrorToast(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await action();
      onClose();
    } catch (err: unknown) {
      // Capture error message to display in modal error feedback and allow user to correct input
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses formulir.";
      setError(msg);
      onErrorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}
