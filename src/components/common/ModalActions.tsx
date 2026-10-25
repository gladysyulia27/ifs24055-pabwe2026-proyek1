import React from "react";

interface ModalActionsProps {
  loading: boolean;
  submitLabel: React.ReactNode;
  loadingLabel: string;
  onCancel: () => void;
  submitClassName?: string;
}

export function ModalActions({
  loading,
  submitLabel,
  loadingLabel,
  onCancel,
  submitClassName = "btn-accent"
}: ModalActionsProps) {
  return (
    <div className="modal-actions">
      <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
        Kembali
      </button>
      <button className={`btn ${submitClassName}`} type="submit" disabled={loading}>
        {loading ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}
