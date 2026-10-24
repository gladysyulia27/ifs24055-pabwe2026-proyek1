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
          <div className="profile-avatar-row">
            <div className="user-avatar profile-avatar-lg">
              {getUserInitials(user)}
            </div>
            <div>
              <h2 className="profile-title">{user.full_name}</h2>
              <span className={`status ${isAdmin ? "status-blue" : "status-green"} profile-status-pill`}>
                {isAdmin ? `Admin Departemen ${user.department_name}` : "Mahasiswa / Peminjam"}
              </span>
            </div>
          </div>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <Hash size={16} className="icon-muted" />
              <div>
                <b className="profile-info-label">NIM / Nomor Identitas</b>
                <span className="profile-info-value">{user.identifier}</span>
              </div>
            </div>

            <div className="profile-info-row">
              <UserIcon size={16} className="icon-muted" />
              <div>
                <b className="profile-info-label">Username</b>
                <span className="profile-info-value">@{user.username}</span>
              </div>
            </div>

            <div className="profile-info-row">
              <Mail size={16} className="icon-muted" />
              <div>
                <b className="profile-info-label">Alamat Email</b>
                <span className="profile-info-value">{user.email}</span>
              </div>
            </div>

            <div className="profile-info-row">
              <Phone size={16} className="icon-muted" />
              <div>
                <b className="profile-info-label">No. Kontak WhatsApp / HP</b>
                <span className="profile-info-value">{user.contact_phone || "Belum diatur"}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="profile-info-row">
                <Building2 size={16} className="icon-muted" />
                <div>
                  <b className="profile-info-label">Departemen yang Dikelola</b>
                  <span className="profile-info-value">Departemen {user.department_name}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Security & Activity Summary */}
        <section className="panel">
          <PanelHead title="Hak Akses & Aktivitas" subtitle="Izin operasional sistem" />
          <div className="profile-info-list">
            <div className="profile-notice-box">
              <div className="profile-notice-header">
                <Shield size={18} className="profile-notice-icon-olive" />
                <b className="profile-notice-title">Otorisasi Peran: {user.role}</b>
              </div>
              <p className="profile-notice-desc">
                {isAdmin
                  ? `Anda memiliki izin penuh untuk mengelola inventori, menambah barang baru, serta memverifikasi dan menyetujui peminjaman untuk Departemen ${user.department_name}.`
                  : "Anda memiliki hak akses untuk menjelajahi seluruh katalog barang, mengajukan permohonan peminjaman, serta mengunggah bukti pengembalian barang."}
              </p>
            </div>

            <div className="profile-notice-box">
              <div className="profile-notice-header">
                <Calendar size={18} className="profile-notice-icon-pink" />
                <b className="profile-notice-title">Riwayat Transaksi Terkait</b>
              </div>
              <p className="profile-notice-desc">
                Total <b>{userLoans.length}</b> transaksi peminjaman tercatat pada akun ini.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
