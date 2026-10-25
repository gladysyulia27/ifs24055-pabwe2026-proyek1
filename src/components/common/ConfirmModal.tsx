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
  isAlert?: boolean; // Mode alert: modal dialog pemberitahuan satu tombol konfirmasi
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
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div
        className="modal confirm-modal confirm-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="confirm-modal-header">
          <div className={`confirm-icon-badge confirm-badge-${variant}`}>
            {getVariantIcon()}
          </div>
          <button
            type="button"
            className="icon-btn confirm-modal-close-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Tutup dialog"
          >
            <X size={18} />
          </button>
        </div>

        <h3 id="confirm-modal-title" className="confirm-modal-title">
          {title}
        </h3>

        <p className="confirm-modal-message">
          {message}
        </p>

        {highlightText && (
          <div className="confirm-highlight-box">
            <b>{highlightText}</b>
          </div>
        )}

        {description && (
          <p className="confirm-modal-detail">
            {description}
          </p>
        )}

        <div className="confirm-modal-actions">
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
            className={`${getConfirmBtnClass()} confirm-modal-btn-inner`}
            onClick={handleConfirmClick}
            disabled={submitting}
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
