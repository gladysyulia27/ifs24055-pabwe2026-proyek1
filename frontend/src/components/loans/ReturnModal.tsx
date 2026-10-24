"use client";

import React, { useState } from "react";
import { Loan } from "@/types";
import { Modal } from "@/components/common/Modal";
import { Field } from "@/components/common/Field";
import { FormError } from "@/components/common/FormError";
import { ModalActions } from "@/components/common/ModalActions";
import { ItemSummary } from "@/components/inventory/ItemThumb";
import { useFormSubmission } from "@/hooks/useFormSubmission";

interface ReturnModalProps {
  loan: Loan;
  onClose: () => void;
  onSubmit: (loanId: number, proofUrl: string, note?: string) => Promise<void>;
  onErrorToast: (msg: string) => void;
}

export function ReturnModal({ loan, onClose, onSubmit, onErrorToast }: ReturnModalProps) {
  const [proofUrl, setProofUrl] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const { loading, error, submit } = useFormSubmission({ onClose, onErrorToast });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = proofUrl.trim() ? null : "URL bukti foto pengembalian wajib diisi.";
    void submit(validationError, () => onSubmit(loan.id, proofUrl.trim(), returnNote.trim()));
  };

  return (
    <Modal title="Kirim Bukti Pengembalian Barang" onClose={onClose}>
      <ItemSummary
        source={loan.inventory_name}
        alt={loan.inventory_name}
        title={loan.inventory_name}
        subtitle={`${loan.department_name} · ${loan.quantity} unit`}
      />

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

        <FormError message={error} />

        <ModalActions loading={loading} loadingLabel="Mengirim..." submitLabel="Kirim Bukti" onCancel={onClose} />
      </form>
    </Modal>
  );
}
