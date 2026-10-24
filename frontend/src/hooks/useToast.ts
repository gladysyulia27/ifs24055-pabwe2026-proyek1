"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TOAST_DURATION_MS = 3500;

export function useToast() {
  const [message, setMessage] = useState("");
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  };

  const hideToast = useCallback(() => {
    clearTimer();
    setMessage("");
  }, []);

  const showToast = useCallback((text: string) => {
    clearTimer();
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(""), TOAST_DURATION_MS);
  }, []);

  useEffect(() => clearTimer, []);

  return { toast: message, showToast, hideToast };
}
