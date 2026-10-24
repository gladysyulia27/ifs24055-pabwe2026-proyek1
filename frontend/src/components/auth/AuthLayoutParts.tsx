import React from "react";
import { Sparkles } from "lucide-react";

export function AuthHeader() {
  return (
    <header className="auth-gate-header">
      <div className="auth-gate-brand">
        <img src="/logo-bem-del.png?v=2" alt="Logo BEM IT Del" />
        <div className="auth-gate-brand-copy">
          <h1>BEM Institut Teknologi Del</h1>
          <span>Sistem Manajemen & Peminjaman Inventori Organisasi</span>
        </div>
      </div>
      <div className="auth-gate-badge">
        <i /> Portal Akses Resmi Mahasiswa & Pengurus
      </div>
    </header>
  );
}

export function AuthHero() {
  return (
    <div className="auth-hero-section">
      <div className="auth-hero-pill">
        <Sparkles size={14} className="landing-hero-pill-icon" />
        <span>GERBANG AUTORISASI RESMI</span>
      </div>

      <h2 className="auth-hero-title">
        Satu Pintu Akses <span>Inventori Terpadu</span> BEM IT Del
      </h2>

      <p className="auth-hero-subtitle">
        Mahasiswa dan Pengelola Departemen BEM wajib masuk terlebih dahulu untuk mengakses katalog logistik,
        mengajukan permohonan peminjaman, serta mengawasi ketersediaan barang.
      </p>

      <div className="auth-sway-showcase">
        <div className="auth-sway-glow" />
        <div className="auth-sway-logo-wrap">
          <img src="/logo-bem-del.png?v=2" alt="Logo Resmi BEM Institut Teknologi Del" />
          <div className="auth-sway-shadow" />
        </div>
      </div>
    </div>
  );
}
