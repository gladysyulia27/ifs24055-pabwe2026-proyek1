"use client";

import React from "react";
import Link from "next/link";
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
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)", color: "var(--ink)", display: "flex", flexDirection: "column" }}>
      {/* Public Navigation */}
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
      <main style={{ flex: 1 }}>
        <section style={{ maxWidth: 1000, margin: "60px auto 40px", padding: "0 24px", textAlign: "center" }}>
          <div className="auth-hero-pill" style={{ display: "inline-flex", marginBottom: 16 }}>
            <Sparkles size={14} style={{ color: "var(--pink-ink)" }} />
            <span>PORTAL LOGISTIK & INVENTORI KAMPUS</span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontFamily: "var(--font-display)", margin: "0 0 18px", color: "var(--ink)", lineHeight: 1.2 }}>
            Satu Sistem, Semua Inventori, <br />
            <span style={{ color: "var(--olive)" }}>Kegiatan Kampus Lebih Baik</span>
          </h1>

          <p style={{ maxWidth: 640, margin: "0 auto 28px", fontSize: 16, color: "var(--ink-secondary)", lineHeight: 1.6 }}>
            Platform peminjaman dan pengelolaan perlengkapan kegiatan mahasiswa Institut Teknologi Del. Akses logistik departemen BEM secara transparan dan terdata.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            {user ? (
              <Link href="/dashboard" className="btn btn-primary" style={{ padding: "12px 24px", fontSize: 15 }}>
                Masuk ke Dashboard Anda <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-primary" style={{ padding: "12px 24px", fontSize: 15 }}>
                  Mulai Peminjaman Barang <ArrowRight size={16} />
                </Link>
                <Link href="/register" className="btn btn-secondary" style={{ padding: "12px 24px", fontSize: 15 }}>
                  Daftar Akun Mahasiswa
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ maxWidth: 1000, margin: "40px auto 60px", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {features.map((f, i) => (
              <div key={i} className="panel" style={{ padding: 22 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center", color: "var(--olive)", marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, margin: "0 0 8px", color: "var(--ink)" }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--ink-secondary)", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="footer" style={{ borderTop: "1px solid var(--border)", padding: "24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: 12 }}>
          <div>
            <b>BEM IT Del</b>
            <span style={{ display: "block", fontSize: 12, color: "var(--ink-muted)" }}>Sistem Manajemen Peminjaman Inventori</span>
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 13 }}>
            <Link href="/about" style={{ color: "var(--ink-secondary)", textDecoration: "none" }}>
              Tentang
            </Link>
            <Link href="/login" style={{ color: "var(--ink-secondary)", textDecoration: "none" }}>
              Masuk
            </Link>
            <Link href="/register" style={{ color: "var(--ink-secondary)", textDecoration: "none" }}>
              Daftar
            </Link>
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>© 2026 BEM Institut Teknologi Del</span>
        </div>
      </footer>
    </div>
  );
}
