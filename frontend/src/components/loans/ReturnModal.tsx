"use client";

import React, { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Loan } from "@/types";
import { Modal } from "@/components/common/Modal";
import { Field } from "@/components/common/Field";
import { getItemImage } from "@/utils/itemImage";

interface ReturnModalProps {
  loan: Loan | null;
  onClose: () => void;
  onSubmit: (loanId: number, proofUrl: string, note?: string) => Promise<void>;
  onErrorToast: (msg: string) => void;
}

export function ReturnModal({ loan, onClose, onSubmit, onErrorToast }: ReturnModalProps) {
  const [proofUrl, setProofUrl] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl.trim()) {
      onErrorToast("URL bukti foto pengembalian wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(loan.id, proofUrl.trim(), returnNote.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const img = getItemImage(loan.inventory_name);

  return (
    <Modal title="Kirim Bukti Pengembalian Barang" onClose={onClose}>
      <div className="selected-item">
        {img ? (
          <img src={img} alt={loan.inventory_name} className="item-thumb-img" style={{ width: 48, height: 48 }} />
        ) : (
          <div className="mini-item">
            <ImageIcon size={20} />
          </div>
        )}
        <div>
          <b>{loan.inventory_name}</b>
          <span>{loan.department_name} · {loan.quantity} unit</span>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <Field
          label="URL Bukti Foto Pengembalian *"
          help="Sertakan URL foto barang yang telah dikembalikan kepada pengelola departemen."
        >
          <input
            required
            type="url"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... atau link foto Google Drive"
          />
        </Field>

        <Field label="Catatan Kondisi Barang Saat Pengembalian">
          <textarea
            rows={3}
            value={returnNote}
            onChange={(e) => setReturnNote(e.target.value)}
            placeholder="Contoh: Barang dalam kondisi lengkap dan bersih tanpa kerusakan."
          />
        </Field>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Kembali
          </button>
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Bukti"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
