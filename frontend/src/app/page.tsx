"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, ShieldCheck, Calendar, CheckCircle2, LogIn, UserPlus, Sparkles, Layers } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <Layers size={22} />,
      title: "6 Departemen BEM",
      desc: "DEPKOMINFO, DIPTEK, DEPAGSOS, DESARPRAS, DEPOL, dan DEPSENBUD dalam satu sistem."
    },
    {
      icon: <Package size={22} />,
      title: "Katalog & Stok Real-Time",
      desc: "Cek ketersediaan kamera, sound system, alat musik, hingga perlengkapan olahraga secara instan."
    },
    {
      icon: <Calendar size={22} />,
      title: "Jadwal & Agenda Kalender",
      desc: "Pantau penggunaan barang agar jadwal kegiatan tidak bentrok antar kepanitiaan."
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Verifikasi Pengembalian",
      desc: "Unggah bukti foto kondisi barang saat pengembalian untuk akuntabilitas penuh."
    }
  ];

  return (
    <div className="landing-layout">
      {/* Public Navigation */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/" className="landing-brand">
            <Image
              src="/logo-bem-del.png"
              alt="Logo BEM IT Del"
              width={40}
              height={40}
              className="landing-brand-logo"
              priority
            />
            <div>
              <strong className="landing-brand-title">BEM IT Del</strong>
              <span className="landing-brand-sub">SISTEM INVENTORI RESMI</span>
            </div>
          </Link>

          <nav className="landing-nav">
            <Link href="/about" className="text-btn">
              Tentang
            </Link>
            {user ? (
              <Link href="/dashboard" className="btn btn-primary btn-small">
                Buka Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary btn-small">
                  <LogIn size={14} /> Masuk (Login)
                </Link>
                <Link href="/register" className="btn btn-accent btn-small">
                  <UserPlus size={14} /> Daftar Akun
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-main">
        <section className="landing-hero">
          <div className="auth-hero-pill landing-hero-pill">
            <Sparkles size={14} className="landing-hero-pill-icon" />
            <span>PORTAL LOGISTIK & INVENTORI KAMPUS</span>
          </div>

          <h1 className="landing-title">
            Satu Sistem, Semua Inventori, <br />
            <span className="landing-title-accent">Kegiatan Kampus Lebih Baik</span>
          </h1>

          <p className="landing-desc">
            Platform peminjaman dan pengelolaan perlengkapan kegiatan mahasiswa Institut Teknologi Del. Akses logistik departemen BEM secara transparan dan terdata.
          </p>

          <div className="landing-cta-group">
            {user ? (
              <Link href="/dashboard" className="btn btn-primary landing-cta-btn">
                Masuk ke Dashboard Anda <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-primary landing-cta-btn">
                  Mulai Peminjaman Barang <ArrowRight size={16} />
                </Link>
                <Link href="/register" className="btn btn-secondary landing-cta-btn">
                  Daftar Akun Mahasiswa
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section className="landing-features-section" aria-label="Fitur Unggulan Sistem">
          <h2 className="sr-only">Fitur Unggulan Sistem Inventori BEM IT Del</h2>
          <div className="landing-features-grid">
            {features.map((f, i) => (
              <div key={i} className="panel landing-feature-card">
                <div className="landing-feature-icon-box">
                  {f.icon}
                </div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="footer landing-footer">
        <div className="landing-footer-inner">
          <div>
            <b>BEM IT Del</b>
            <span className="landing-footer-copy">Sistem Manajemen Peminjaman Inventori</span>
          </div>
          <div className="landing-footer-links">
            <Link href="/about" className="landing-footer-link">
              Tentang
            </Link>
            <Link href="/login" className="landing-footer-link">
              Masuk
            </Link>
            <Link href="/register" className="landing-footer-link">
              Daftar
            </Link>
          </div>
          <span className="landing-footer-copy">© 2026 BEM Institut Teknologi Del</span>
        </div>
      </footer>
    </div>
  );
}
