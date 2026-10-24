"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Item, LoanFormData, User } from "@/types";
import { Modal } from "@/components/common/Modal";
import { Field } from "@/components/common/Field";
import { FormError } from "@/components/common/FormError";
import { ModalActions } from "@/components/common/ModalActions";
import { ItemSummary } from "@/components/inventory/ItemThumb";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { todayISO } from "@/utils/date";
import { validateLoanForm } from "@/utils/validation";

interface LoanModalProps {
  item: Item;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (data: LoanFormData, item: Item) => Promise<void>;
  onErrorToast: (msg: string) => void;
}

export function LoanModal({ item, currentUser, onClose, onSubmit, onErrorToast }: LoanModalProps) {
  const [form, setForm] = useState<LoanFormData>(() => ({
    borrower_name: currentUser?.full_name || "",
    borrower_id: currentUser?.identifier || "",
    borrower_contact: currentUser?.contact_phone || "",
    organization: "Mahasiswa",
    purpose: "",
    quantity: "1",
    start_date: todayISO(),
    due_date: todayISO()
  }));
  const { loading, error, submit } = useFormSubmission({ onClose, onErrorToast });

  const updateField = (field: keyof LoanFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(validateLoanForm({ ...form, maxAvailableStock: item.available_stock }), () => onSubmit(form, item));
  };

  return (
    <Modal title="Formulir Pengajuan Peminjaman" onClose={onClose}>
      <ItemSummary
        source={item}
        alt={item.name}
        title={item.name}
        subtitle={`${item.department_name} · Tersedia: ${item.available_stock} dari ${item.total_stock} unit`}
      />

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Field label="Nama Peminjam *">
            <input
              required
              value={form.borrower_name}
              onChange={updateField("borrower_name")}
              placeholder="Nama lengkap peminjam"
            />
          </Field>
          <Field label="NIM / Pengenal *">
            <input
              required
              value={form.borrower_id}
              onChange={updateField("borrower_id")}
              placeholder="Contoh: 11S21001"
            />
          </Field>
          <Field label="No. WhatsApp / Kontak">
            <input value={form.borrower_contact} onChange={updateField("borrower_contact")} placeholder="08xxxxxxxxxx" />
          </Field>
          <Field label="Organisasi / Kepanitiaan">
            <input
              value={form.organization}
              onChange={updateField("organization")}
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
              onChange={updateField("quantity")}
            />
          </Field>
          <Field label="Tanggal Mulai *">
            <input type="date" required value={form.start_date} onChange={updateField("start_date")} />
          </Field>
          <Field label="Batas Tanggal Kembali *">
            <input
              type="date"
              required
              min={form.start_date}
              value={form.due_date}
              onChange={updateField("due_date")}
            />
          </Field>
        </div>

        <Field label="Tujuan & Alasan Peminjaman *">
          <textarea
            required
            rows={3}
            value={form.purpose}
            onChange={updateField("purpose")}
            placeholder="Jelaskan kebutuhan kegiatan peminjaman barang ini..."
          />
        </Field>

        <FormError message={error} />

        <div className="form-note">
          <ShieldCheck size={17} />
          Pengajuan akan langsung masuk ke panel persetujuan pengelola {item.department_name}.
        </div>

        <ModalActions
          loading={loading}
          loadingLabel="Mengirim..."
          submitLabel={
            <>
              Kirim Pengajuan <ArrowRight size={16} />
            </>
          }
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
