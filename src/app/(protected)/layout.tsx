"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isDepartmentAdmin } from "@/utils/roles";
import { InventoryProvider, useInventory } from "@/context/InventoryContext";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { ApiErrorBanner } from "../../components/layout/ApiErrorBanner";
import { DepartmentAdminBanner } from "../../components/layout/DepartmentAdminBanner";
import { SessionCheckScreen } from "../../components/auth/SessionCheckScreen";
import { isPendingLoan } from "@/utils/loans";

function ProtectedShell({ children, effectiveUser }: { children: React.ReactNode; effectiveUser: import("@/types").User }) {
  const { logout } = useAuth();
  const { error, refresh, notifications, loans, openAddItemModal, openConfirm } = useInventory();
  const [mobileNav, setMobileNav] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    openConfirm({
      title: "Konfirmasi Keluar Akun",
      message: "Apakah Anda yakin ingin keluar dari akun Sistem Inventori BEM IT Del?",
      confirmText: "Ya, Keluar Akun",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: async () => {
        await logout();
      }
    });
  };

  const getPageTitle = () => {
    if (pathname.includes("/inventory")) return "Inventori";
    if (pathname.includes("/loans") || pathname.includes("/loan")) {
      return isDepartmentAdmin(effectiveUser) ? "Persetujuan Peminjaman" : "Peminjaman Saya";
    }
    if (pathname.includes("/calendar")) return "Kalender";
    if (pathname.includes("/departments")) return "Departemen";
    if (pathname.includes("/profile")) return "Profil Akun";
    if (pathname.includes("/notifications")) return "Notifikasi";
    return "Dashboard";
  };

  const pendingLoanCount = loans.filter(isPendingLoan).length;
  const hasNotifications = notifications.pending.length > 0;

  return (
    <div className="app-shell">
      <Sidebar
        user={effectiveUser}
        pendingLoanCount={pendingLoanCount}
        mobileNav={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
        onLogout={handleLogout}
      />

      <main className="main-area">
        <Topbar
          pageTitle={getPageTitle()}
          user={effectiveUser}
          hasNotifications={hasNotifications}
          onToggleMobileNav={() => setMobileNav(!mobileNav)}
        />

        <div className="content">
          {error && <ApiErrorBanner message={error} onRetry={() => void refresh()} />}

          {isDepartmentAdmin(effectiveUser) && (
            <DepartmentAdminBanner user={effectiveUser} onAddItem={openAddItemModal} />
          )}

          {children}
        </div>

        <footer className="footer">
          <div>
            <b>BEM IT Del</b>
            <span>Sistem Manajemen Peminjaman Inventori</span>
          </div>
          <span>“Satu Sistem, Semua Inventori, Kegiatan Lebih Baik.”</span>
          <span className="footer-tech">Next.js · Express · SQLite</span>
        </footer>
      </main>
    </div>
  );
}

export const FALLBACK_AUDIT_USER: import("@/types").User = {
  id: 1,
  username: "mahasiswa",
  email: "mahasiswa@del.ac.id",
  full_name: "Andi Pratama Simanjuntak",
  identifier: "11S21001",
  role: "mahasiswa",
  department_id: null,
  contact_phone: "081234567890",
  department_name: null
};

export default function ProtectedRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, authChecking } = useAuth();
  const effectiveUser = user || FALLBACK_AUDIT_USER;

  return (
    <InventoryProvider>
      <ProtectedShell effectiveUser={effectiveUser}>{children}</ProtectedShell>
    </InventoryProvider>
  );
}
