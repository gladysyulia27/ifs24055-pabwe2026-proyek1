"use client";

import React, { useState } from "react";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import { Field } from "@/components/common/Field";

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function PhotoUpload({ value, onChange, onErrorToast }: PhotoUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onErrorToast?.("File yang dipilih harus berupa file gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onErrorToast?.("Ukuran foto maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL("image/webp", 0.86);
          onChange(compressed);
        } else {
          onChange(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="photo-upload-section">
      <label className="field-label">Foto Barang</label>
      {value ? (
        <div className="photo-preview-box">
          <img src={value} alt="Preview Foto Barang" className="photo-preview-img" />
          <div className="photo-preview-overlay">
            <label className="btn btn-secondary btn-small photo-upload-btn" title="Ganti Foto">
              <Camera size={14} /> Ganti Foto
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
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
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <div className="photo-dropzone-icon">
            <UploadCloud size={24} />
          </div>
          <div className="photo-dropzone-text">
            <b>Unggah Foto Barang</b>
            <span>Klik atau seret file foto ke sini (PNG, JPG, WebP)</span>
          </div>
        </label>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <button
          type="button"
          className="text-btn"
          style={{ fontSize: 11.5 }}
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
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
