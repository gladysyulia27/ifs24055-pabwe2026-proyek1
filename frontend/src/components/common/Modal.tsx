import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string | number;
}

export function Modal({ title, children, onClose, maxWidth }: ModalProps) {
  const isLarge = maxWidth === "680px" || maxWidth === 680;
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className={`modal ${isLarge ? "modal-lg" : ""}`}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Tutup modal">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
