"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle, Loader2, Trash2, X } from "lucide-react";

export type ConfirmVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  description?: string;
  highlightText?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isAlert?: boolean; // Jika true, hanya tombol konfirmasi (pengganti window.alert)
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  description,
  highlightText,
  confirmText = "Lanjutkan",
  cancelText = "Batal",
  variant = "info",
  isAlert = false,
  onConfirm,
  onClose
}: ConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus pada tombol utama saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      setSubmitting(false);
      const timer = setTimeout(() => confirmBtnRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
      onClose();
    } catch {
      // Error sudah ditangani di level runner / action
    } finally {
      setSubmitting(false);
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 size={24} className="confirm-icon-danger" />;
      case "warning":
        return <AlertTriangle size={24} className="confirm-icon-warning" />;
      case "success":
        return <CheckCircle2 size={24} className="confirm-icon-success" />;
      default:
        return <HelpCircle size={24} className="confirm-icon-info" />;
    }
  };

  const getConfirmBtnClass = () => {
    switch (variant) {
      case "danger":
        return "btn btn-primary action-red";
      case "warning":
        return "btn btn-accent";
      case "success":
        return "btn btn-primary";
      default:
        return "btn btn-primary";
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="modal confirm-modal" style={{ maxWidth: 460, padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div className={`confirm-icon-badge confirm-badge-${variant}`}>
            {getVariantIcon()}
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Tutup dialog"
            style={{ marginTop: -4, marginRight: -4 }}
          >
            <X size={18} />
          </button>
        </div>

        <h3 id="confirm-modal-title" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 8px 0", color: "var(--ink)" }}>
          {title}
        </h3>

        <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-secondary)", margin: "0 0 12px 0" }}>
          {message}
        </p>

        {highlightText && (
          <div className="confirm-highlight-box">
            <b>{highlightText}</b>
          </div>
        )}

        {description && (
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-muted)", margin: "0 0 20px 0" }}>
            {description}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          {!isAlert && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              {cancelText}
            </button>
          )}

          <button
            ref={confirmBtnRef}
            type="button"
            className={getConfirmBtnClass()}
            onClick={handleConfirmClick}
            disabled={submitting}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="spin" /> Memproses...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
