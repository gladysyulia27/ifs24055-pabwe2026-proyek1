"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Building, Mail, Phone, ExternalLink } from "lucide-react";

export default function AboutPage() {
  const departments = [
    { name: "DEPKOMINFO", desc: "Departemen Komunikasi & Informasi: Kamera, Microphone rekam, Lightning" },
    { name: "DIPTEK", desc: "Departemen Ilmu Pengetahuan & Teknologi: Perlengkapan IT, Lab, dan multimedia" },
    { name: "DEPAGSOS", desc: "Departemen Agama & Sosial: Vas bunga, Alkitab, Lilin kegiatan rohani" },
    { name: "DESARPRAS", desc: "Departemen Sarana & Prasarana: Sound system, Microphone, Speaker, Kabel" },
    { name: "DEPOL", desc: "Departemen Olahraga: Bola basket, Bola futsal, Raket, Kok badminton, Net" },
    { name: "DEPSENBUD", desc: "Departemen Seni & Budaya: Gitar, Bass, Pita tali, Kuas lukis" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)", color: "var(--ink)", display: "flex", flexDirection: "column" }}>
      {/* Public Header */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
            <img src="/logo-bem-del.png" alt="Logo BEM IT Del" style={{ height: 38, objectFit: "contain" }} />
            <div>
              <strong style={{ fontSize: 16, display: "block" }}>BEM IT Del</strong>
              <span style={{ fontSize: 11, color: "var(--ink-secondary)", letterSpacing: "0.5px" }}>SISTEM INVENTORI RESMI</span>
            </div>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" className="text-btn">
              Beranda
            </Link>
            <Link href="/login" className="btn btn-secondary btn-small">
              Masuk (Login)
            </Link>
            <Link href="/register" className="btn btn-accent btn-small">
              Daftar Akun
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px", flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/" className="text-btn" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
          <div className="eyebrow">TENTANG SISTEM & ORGANISASI</div>
          <h1 style={{ fontSize: 32, fontFamily: "var(--font-display)", margin: "8px 0 12px", color: "var(--ink)" }}>
            Sistem Manajemen Peminjaman Inventori BEM IT Del
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-secondary)", lineHeight: 1.7, margin: 0 }}>
            Platform terpadu untuk memfasilitasi mahasiswa, panitia acara, dan organisasi kemahasiswaan di lingkungan Institut Teknologi Del dalam meminjam fasilitas dan logistik kegiatan secara transparan, bertanggung jawab, dan terdata.
          </p>
        </div>

        {/* Section: Alur Peminjaman */}
        <section className="panel" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: "var(--ink)" }}>Alur & Regulasi Peminjaman</h2>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--olive)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, flexShrink: 0 }}>
                1
              </div>
              <div>
                <b style={{ fontSize: 14 }}>Pendaftaran Akun & Autentikasi</b>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                  Mahasiswa aktif IT Del mendaftarkan akun menggunakan NIM resmi dan email kampus.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--olive)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, flexShrink: 0 }}>
                2
              </div>
              <div>
                <b style={{ fontSize: 14 }}>Pengajuan Online Melalui Katalog</b>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                  Pilih barang dari departemen terkait, tentukan jadwal mulai dan selesai, serta cantumkan tujuan kegiatan.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--olive)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, flexShrink: 0 }}>
                3
              </div>
              <div>
                <b style={{ fontSize: 14 }}>Verifikasi Pengelola Departemen</b>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                  Penanggung jawab departemen meninjau kelayakan permohonan dan ketersediaan stok fisik barang.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--olive)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, flexShrink: 0 }}>
                4
              </div>
              <div>
                <b style={{ fontSize: 14 }}>Pengembalian & Bukti Foto</b>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                  Peminjam mengembalikan barang tepat waktu dan mengunggah bukti dokumentasi foto fisik barang.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Departemen */}
        <section className="panel" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 14, color: "var(--ink)" }}>Departemen Pengelola Inventori</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
            {departments.map((dept) => (
              <div key={dept.name} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-inner)", padding: 14 }}>
                <b style={{ fontSize: 14, color: "var(--ink)" }}>{dept.name}</b>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                  {dept.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact info */}
        <section className="panel">
          <h2 style={{ fontSize: 18, marginBottom: 12, color: "var(--ink)" }}>Kontak & Sekretariat</h2>
          <p style={{ fontSize: 13, color: "var(--ink-secondary)", margin: "0 0 16px" }}>
            Sekretariat BEM Institut Teknologi Del, Gedung Kemahasiswaan IT Del, Jl. Sisingamangaraja, Sitoluama, Laguboti, Toba, Sumatera Utara.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Mail size={16} className="icon-muted" />
              <span>bem@del.ac.id</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Phone size={16} className="icon-muted" />
              <span>+62 812-3456-7890</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" style={{ borderTop: "1px solid var(--border)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div>
            <b>BEM IT Del</b>
            <span style={{ display: "block", fontSize: 12, color: "var(--ink-muted)" }}>Sistem Manajemen Peminjaman Inventori</span>
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-secondary)" }}>Institut Teknologi Del</span>
        </div>
      </footer>
    </div>
  );
}
