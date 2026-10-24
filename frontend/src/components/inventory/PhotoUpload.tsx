"use client";

import React, { useState } from "react";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import { Field } from "@/components/common/Field";
import { compressImageFile, MAX_PHOTO_BYTES } from "@/utils/imageCompression";

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function PhotoUpload({ value, onChange, onErrorToast }: PhotoUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onErrorToast?.("File yang dipilih harus berupa file gambar (JPG, PNG, WebP).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      onErrorToast?.("Ukuran foto maksimal 5 MB.");
      return;
    }

    try {
      onChange(await compressImageFile(file));
    } catch {
      onErrorToast?.("Gagal membaca file gambar.");
    }
  };

  const fileInput = (
    <input type="file" accept="image/*" className="photo-file-input" onChange={handleFileSelected} />
  );

  return (
    <div className="photo-upload-section">
      <label className="field-label">Foto Barang</label>
      {value ? (
        <div className="photo-preview-box">
          <img src={value} alt="Preview Foto Barang" className="photo-preview-img" />
          <div className="photo-preview-overlay">
            <label className="btn btn-secondary btn-small photo-upload-btn" title="Ganti Foto">
              <Camera size={14} /> Ganti Foto
              {fileInput}
            </label>
            <button
              type="button"
              className="btn btn-secondary btn-small photo-remove-btn"
              onClick={() => onChange("")}
              title="Hapus Foto"
            >
              <Trash2 size={14} /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <label className="photo-dropzone">
          {fileInput}
          <div className="photo-dropzone-icon">
            <UploadCloud size={24} />
          </div>
          <div className="photo-dropzone-text">
            <b>Unggah Foto Barang</b>
            <span>Klik atau seret file foto ke sini (PNG, JPG, WebP)</span>
          </div>
        </label>
      )}

      <div className="photo-url-toggle">
        <button type="button" className="text-btn" onClick={() => setShowUrlInput((open) => !open)}>
          {showUrlInput ? "Sembunyikan input URL" : "Atau gunakan tautan / URL foto"}
        </button>
      </div>

      {showUrlInput && (
        <Field label="URL / Tautan Foto">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Contoh: https://images.unsplash.com/... atau /assets/kamera.png"
          />
        </Field>
      )}
    </div>
  );
}
