"use client";

import React from "react";
import { User as UserIcon, Shield, Mail, Phone, Hash, Building2, LogOut, Calendar } from "lucide-react";
import { User, Loan } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelHead } from "@/components/common/PanelHead";
import { getUserInitials, isDepartmentAdmin } from "@/utils/roles";

interface ProfileViewProps {
  user: User;
  userLoans: Loan[];
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileView({ user, userLoans, onBack, onLogout }: ProfileViewProps) {
  const isAdmin = isDepartmentAdmin(user);

  return (
    <>
      <PageHeader
        eyebrow="AKUN & PROFIL PENGGUNA"
        title="Profil & Pengaturan Akun"
        description="Kelola informasi identitas, kontak, dan hak akses Anda dalam Sistem Inventori BEM IT Del."
        onBack={onBack}
        actions={
          <button type="button" className="btn btn-secondary action-red" onClick={onLogout}>
            <LogOut size={15} /> Keluar dari Akun
          </button>
        }
      />

      <div className="dashboard-grid">
        {/* User Card */}
        <section className="panel">
          <PanelHead title="Identitas Akun" subtitle="Informasi kredensial login" />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div className="user-avatar" style={{ width: 56, height: 56, fontSize: 20 }}>
              {getUserInitials(user)}
            </div>
            <div>
              <h2 style={{ fontSize: 18, margin: 0, color: "var(--ink)" }}>{user.full_name}</h2>
              <span className={`status ${isAdmin ? "status-blue" : "status-green"}`} style={{ marginTop: 6, display: "inline-block" }}>
                {isAdmin ? `Admin Departemen ${user.department_name}` : "Mahasiswa / Peminjam"}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Hash size={16} className="icon-muted" />
              <div>
                <b style={{ fontSize: 12, color: "var(--ink-secondary)", display: "block" }}>NIM / Nomor Identitas</b>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{user.identifier}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <UserIcon size={16} className="icon-muted" />
              <div>
                <b style={{ fontSize: 12, color: "var(--ink-secondary)", display: "block" }}>Username</b>
                <span style={{ fontSize: 14, fontWeight: 600 }}>@{user.username}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mail size={16} className="icon-muted" />
              <div>
                <b style={{ fontSize: 12, color: "var(--ink-secondary)", display: "block" }}>Alamat Email</b>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{user.email}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Phone size={16} className="icon-muted" />
              <div>
                <b style={{ fontSize: 12, color: "var(--ink-secondary)", display: "block" }}>No. Kontak WhatsApp / HP</b>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{user.contact_phone || "Belum diatur"}</span>
              </div>
            </div>

            {isAdmin && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Building2 size={16} className="icon-muted" />
                <div>
                  <b style={{ fontSize: 12, color: "var(--ink-secondary)", display: "block" }}>Departemen yang Dikelola</b>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Departemen {user.department_name}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Security & Activity Summary */}
        <section className="panel">
          <PanelHead title="Hak Akses & Aktivitas" subtitle="Izin operasional sistem" />
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "var(--surface)", padding: 14, borderRadius: "var(--radius-inner)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Shield size={18} style={{ color: "var(--olive)" }} />
                <b style={{ fontSize: 13, color: "var(--ink)" }}>Otorisasi Peran: {user.role}</b>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                {isAdmin
                  ? `Anda memiliki izin penuh untuk mengelola inventori, menambah barang baru, serta memverifikasi dan menyetujui peminjaman untuk Departemen ${user.department_name}.`
                  : "Anda memiliki hak akses untuk menjelajahi seluruh katalog barang, mengajukan permohonan peminjaman, serta mengunggah bukti pengembalian barang."}
              </p>
            </div>

            <div style={{ background: "var(--surface)", padding: 14, borderRadius: "var(--radius-inner)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Calendar size={18} style={{ color: "var(--pink-ink)" }} />
                <b style={{ fontSize: 13, color: "var(--ink)" }}>Riwayat Transaksi Terkait</b>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--ink-secondary)" }}>
                Total <b>{userLoans.length}</b> transaksi peminjaman tercatat pada akun ini.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
