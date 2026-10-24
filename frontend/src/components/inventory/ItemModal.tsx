"use client";

import React, { useState } from "react";
import { Item, ItemFormData, User } from "@/types";
import { Modal } from "@/components/common/Modal";
import { Field } from "@/components/common/Field";
import { PhotoUpload } from "@/components/inventory/PhotoUpload";
import { validateItemForm } from "@/utils/validation";

interface ItemModalProps {
  isOpen: boolean;
  editingItem: Item | null;
  currentUser: User;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onErrorToast: (msg: string) => void;
}

export function ItemModal({
  isOpen,
  editingItem,
  currentUser,
  onClose,
  onSubmit,
  onErrorToast
}: ItemModalProps) {
  const [form, setForm] = useState<ItemFormData>(() => ({
    department_id: editingItem ? String(editingItem.department_id) : String(currentUser.department_id || ""),
    name: editingItem?.name || "",
    category: editingItem?.category || "Umum",
    description: editingItem?.description || "",
    total_stock: editingItem ? String(editingItem.total_stock) : "1",
    condition_status: editingItem?.condition_status || "Baik",
    image_url: editingItem?.image_url || ""
  }));

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateItemForm(form);
    if (error) {
      setValidationError(error);
      onErrorToast(error);
      return;
    }
    setValidationError(null);
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
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
            <input
              disabled
              value={currentUser.department_name || ""}
              style={{ background: "var(--surface)", fontWeight: 700 }}
            />
          </Field>

          <Field label="Nama Barang *" error={validationError && !form.name.trim() ? "Nama wajib diisi" : undefined}>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Kamera DSLR Canon"
            />
          </Field>

          <Field label="Kategori">
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Contoh: Dokumentasi, Audio, Olahraga"
            />
          </Field>

          <Field label="Stok Total *">
            <input
              type="number"
              min="0"
              required
              value={form.total_stock}
              onChange={(e) => setForm({ ...form, total_stock: e.target.value })}
            />
          </Field>

          <Field label="Kondisi Barang">
            <select
              value={form.condition_status}
              onChange={(e) => setForm({ ...form, condition_status: e.target.value })}
            >
              <option>Baik</option>
              <option>Perlu Perbaikan</option>
              <option>Rusak</option>
            </select>
          </Field>
        </div>

        <Field label="Deskripsi Barang">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Keterangan kelengkapan, nomor seri, atau kondisi barang..."
          />
        </Field>

        {validationError && (
          <div style={{ color: "#C53D34", fontSize: 13, fontWeight: 600 }}>
            {validationError}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Kembali
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Inventori"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
