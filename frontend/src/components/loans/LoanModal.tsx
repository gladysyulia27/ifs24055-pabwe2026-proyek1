"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, ImageIcon } from "lucide-react";
import { Item, LoanFormData, User } from "@/types";
import { Modal } from "@/components/common/Modal";
import { Field } from "@/components/common/Field";
import { getItemImage } from "@/utils/itemImage";
import { validateLoanForm } from "@/utils/validation";

interface LoanModalProps {
  isOpen: boolean;
  item: Item | null;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (data: LoanFormData, item: Item) => Promise<void>;
  onErrorToast: (msg: string) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function LoanModal({
  isOpen,
  item,
  currentUser,
  onClose,
  onSubmit,
  onErrorToast
}: LoanModalProps) {
  const [form, setForm] = useState<LoanFormData>(() => ({
    borrower_name: currentUser?.full_name || "",
    borrower_id: currentUser?.identifier || "",
    borrower_contact: currentUser?.contact_phone || "",
    organization: "Mahasiswa",
    purpose: "",
    quantity: "1",
    start_date: today(),
    due_date: today()
  }));

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateLoanForm({
      ...form,
      maxAvailableStock: item.available_stock
    });

    if (error) {
      setValidationError(error);
      onErrorToast(error);
      return;
    }

    setValidationError(null);
    setLoading(true);
    try {
      await onSubmit(form, item);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const img = getItemImage(item);

  return (
    <Modal title="Formulir Pengajuan Peminjaman" onClose={onClose}>
      <div className="selected-item">
        {img ? (
          <img src={img} alt={item.name} className="item-thumb-img" style={{ width: 48, height: 48 }} />
        ) : (
          <div className="mini-item">
            <ImageIcon size={20} />
          </div>
        )}
        <div>
          <b>{item.name}</b>
          <span>{item.department_name} · Tersedia: {item.available_stock} dari {item.total_stock} unit</span>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Field label="Nama Peminjam *">
            <input
              required
              value={form.borrower_name}
              onChange={(e) => setForm({ ...form, borrower_name: e.target.value })}
              placeholder="Nama lengkap peminjam"
            />
          </Field>
          <Field label="NIM / Pengenal *">
            <input
              required
              value={form.borrower_id}
              onChange={(e) => setForm({ ...form, borrower_id: e.target.value })}
              placeholder="Contoh: 11S21001"
            />
          </Field>
          <Field label="No. WhatsApp / Kontak">
            <input
              value={form.borrower_contact}
              onChange={(e) => setForm({ ...form, borrower_contact: e.target.value })}
              placeholder="08xxxxxxxxxx"
            />
          </Field>
          <Field label="Organisasi / Kepanitiaan">
            <input
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder="Himpunan, UKM, Panitia Dies Natalis, dll."
            />
          </Field>
          <Field label="Jumlah Unit *">
            <input
              type="number"
              min="1"
              max={item.available_stock}
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </Field>
          <Field label="Tanggal Mulai *">
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
          </Field>
          <Field label="Batas Tanggal Kembali *">
            <input
              type="date"
              required
              min={form.start_date}
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Tujuan & Alasan Peminjaman *">
          <textarea
            required
            rows={3}
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            placeholder="Jelaskan kebutuhan kegiatan peminjaman barang ini..."
          />
        </Field>

        {validationError && (
          <div style={{ color: "#C53D34", fontSize: 13, fontWeight: 600 }}>
            {validationError}
          </div>
        )}

        <div className="form-note">
          <ShieldCheck size={17} />
          Pengajuan akan langsung masuk ke panel persetujuan pengelola {item.department_name}.
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Kembali
          </button>
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Pengajuan"} <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
