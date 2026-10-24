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
    <div className="about-layout">
      {/* Public Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/" className="landing-brand">
            <img src="/logo-bem-del.png" alt="Logo BEM IT Del" className="landing-brand-logo" />
            <div>
              <strong className="landing-brand-title">BEM IT Del</strong>
              <span className="landing-brand-sub">SISTEM INVENTORI RESMI</span>
            </div>
          </Link>

          <nav className="landing-nav">
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
      <main className="about-main">
        <div className="about-intro">
          <Link href="/" className="text-btn about-back-link">
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
          <div className="eyebrow">TENTANG SISTEM & ORGANISASI</div>
          <h1 className="about-title">
            Sistem Manajemen Peminjaman Inventori BEM IT Del
          </h1>
          <p className="about-desc">
            Platform terpadu untuk memfasilitasi mahasiswa, panitia acara, dan organisasi kemahasiswaan di lingkungan Institut Teknologi Del dalam meminjam fasilitas dan logistik kegiatan secara transparan, bertanggung jawab, dan terdata.
          </p>
        </div>

        {/* Section: Alur Peminjaman */}
        <section className="panel about-panel">
          <h2 className="about-panel-title">Alur & Regulasi Peminjaman</h2>
          <div className="about-step-list">
            <div className="about-step-item">
              <div className="about-step-badge">1</div>
              <div>
                <b className="about-step-title">Pendaftaran Akun & Autentikasi</b>
                <p className="about-step-desc">
                  Mahasiswa aktif IT Del mendaftarkan akun menggunakan NIM resmi dan email kampus.
                </p>
              </div>
            </div>

            <div className="about-step-item">
              <div className="about-step-badge">2</div>
              <div>
                <b className="about-step-title">Pengajuan Online Melalui Katalog</b>
                <p className="about-step-desc">
                  Pilih barang dari departemen terkait, tentukan jadwal mulai dan selesai, serta cantumkan tujuan kegiatan.
                </p>
              </div>
            </div>

            <div className="about-step-item">
              <div className="about-step-badge">3</div>
              <div>
                <b className="about-step-title">Verifikasi Pengelola Departemen</b>
                <p className="about-step-desc">
                  Penanggung jawab departemen meninjau kelayakan permohonan dan ketersediaan stok fisik barang.
                </p>
              </div>
            </div>

            <div className="about-step-item">
              <div className="about-step-badge">4</div>
              <div>
                <b className="about-step-title">Pengembalian & Bukti Foto</b>
                <p className="about-step-desc">
                  Peminjam mengembalikan barang tepat waktu dan mengunggah bukti dokumentasi foto fisik barang.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Departemen */}
        <section className="panel about-panel">
          <h2 className="about-panel-title">Departemen Pengelola Inventori</h2>
          <div className="about-dept-grid">
            {departments.map((dept) => (
              <div key={dept.name} className="about-dept-card">
                <b className="about-dept-card-title">{dept.name}</b>
                <p className="about-dept-card-desc">
                  {dept.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact info */}
        <section className="panel">
          <h2 className="about-panel-title">Kontak & Sekretariat</h2>
          <p className="about-contact-desc">
            Sekretariat BEM Institut Teknologi Del, Gedung Kemahasiswaan IT Del, Jl. Sisingamangaraja, Sitoluama, Laguboti, Toba, Sumatera Utara.
          </p>
          <div className="about-contact-list">
            <div className="about-contact-item">
              <Mail size={16} className="icon-muted" />
              <span>bem@del.ac.id</span>
            </div>
            <div className="about-contact-item">
              <Phone size={16} className="icon-muted" />
              <span>+62 812-3456-7890</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer landing-footer">
        <div className="landing-footer-inner">
          <div>
            <b>BEM IT Del</b>
            <span className="landing-footer-copy">Sistem Manajemen Peminjaman Inventori</span>
          </div>
          <span className="landing-footer-copy">Institut Teknologi Del</span>
        </div>
      </footer>
    </div>
  );
}
