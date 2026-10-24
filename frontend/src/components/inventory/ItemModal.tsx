"use client";

import React, { useState } from "react";
import { Item, ItemFormData, User } from "@/types";
import { Modal } from "@/components/common/Modal";
import { Field } from "@/components/common/Field";
import { FormError } from "@/components/common/FormError";
import { ModalActions } from "@/components/common/ModalActions";
import { PhotoUpload } from "@/components/inventory/PhotoUpload";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { validateItemForm } from "@/utils/validation";

const CONDITION_OPTIONS = ["Baik", "Perlu Perbaikan", "Rusak"];

interface ItemModalProps {
  editingItem: Item | null;
  currentUser: User;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onErrorToast: (msg: string) => void;
}

export function ItemModal({ editingItem, currentUser, onClose, onSubmit, onErrorToast }: ItemModalProps) {
  const [form, setForm] = useState<ItemFormData>(() => ({
    department_id: String(editingItem?.department_id ?? currentUser.department_id ?? ""),
    name: editingItem?.name || "",
    category: editingItem?.category || "Umum",
    description: editingItem?.description || "",
    total_stock: editingItem ? String(editingItem.total_stock) : "1",
    condition_status: editingItem?.condition_status || "Baik",
    image_url: editingItem?.image_url || ""
  }));
  const { loading, error, submit } = useFormSubmission({ onClose, onErrorToast });

  const updateField =
    (field: keyof ItemFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(validateItemForm(form), () => onSubmit(form));
  };

  return (
    <Modal
      title={editingItem ? "Edit Inventori" : `Tambah Inventori ${currentUser.department_name}`}
      onClose={onClose}
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <PhotoUpload
          value={form.image_url || ""}
          onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
          onErrorToast={onErrorToast}
        />

        <div className="form-grid">
          <Field label="Departemen Pemilik">
            <input disabled className="input-readonly-strong" value={currentUser.department_name || ""} />
          </Field>

          <Field label="Nama Barang *" error={error && !form.name.trim() ? "Nama wajib diisi" : undefined}>
            <input
              required
              value={form.name}
              onChange={updateField("name")}
              placeholder="Contoh: Kamera DSLR Canon"
            />
          </Field>

          <Field label="Kategori">
            <input
              value={form.category}
              onChange={updateField("category")}
              placeholder="Contoh: Dokumentasi, Audio, Olahraga"
            />
          </Field>

          <Field label="Stok Total *">
            <input type="number" min="0" required value={form.total_stock} onChange={updateField("total_stock")} />
          </Field>

          <Field label="Kondisi Barang">
            <select value={form.condition_status} onChange={updateField("condition_status")}>
              {CONDITION_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Deskripsi Barang">
          <textarea
            rows={3}
            value={form.description}
            onChange={updateField("description")}
            placeholder="Keterangan kelengkapan, nomor seri, atau kondisi barang..."
          />
        </Field>

        <FormError message={error} />

        <ModalActions
          loading={loading}
          loadingLabel="Menyimpan..."
          submitLabel="Simpan Inventori"
          submitClassName="btn-primary"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
