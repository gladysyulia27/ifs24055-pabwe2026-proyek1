"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;
  return (
    <div className="toast">
      <CheckCircle2 size={18} />
      {message}
      <button type="button" onClick={onClose} aria-label="Tutup notifikasi">
        <X size={15} />
      </button>
    </div>
  );
}
