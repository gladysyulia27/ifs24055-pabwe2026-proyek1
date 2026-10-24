"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isDepartmentAdmin } from "@/utils/roles";
import { InventoryProvider, useInventory } from "@/context/InventoryContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ApiErrorBanner } from "@/components/layout/ApiErrorBanner";
import { DepartmentAdminBanner } from "@/components/layout/DepartmentAdminBanner";
import { SessionCheckScreen } from "@/components/auth/SessionCheckScreen";
import { isPendingLoan } from "@/utils/loans";

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
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
    if (pathname.includes("/loans")) return "Peminjaman";
    if (pathname.includes("/calendar")) return "Kalender";
    if (pathname.includes("/departments")) return "Departemen";
    if (pathname.includes("/profile")) return "Profil Akun";
    if (pathname.includes("/notifications")) return "Notifikasi";
    return "Dashboard";
  };

  if (!user) return null;

  const pendingLoanCount = loans.filter(isPendingLoan).length;
  const hasNotifications = notifications.pending.length > 0;

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        pendingLoanCount={pendingLoanCount}
        mobileNav={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
        onLogout={handleLogout}
      />

      <main className="main-area">
        <Topbar
          pageTitle={getPageTitle()}
          user={user}
          hasNotifications={hasNotifications}
          onToggleMobileNav={() => setMobileNav(!mobileNav)}
        />

        <div className="content">
          {error && <ApiErrorBanner message={error} onRetry={() => void refresh()} />}

          {isDepartmentAdmin(user) && (
            <DepartmentAdminBanner user={user} onAddItem={openAddItemModal} />
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

export default function ProtectedRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, authChecking } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if auth checking has completed and there is definitively no token/session
    if (!authChecking && !user) {
      const hasToken = typeof window !== "undefined" && (
        document.cookie.includes("token") ||
        document.cookie.includes("bem_inventory_token") ||
        document.cookie.includes("bem_user") ||
        Boolean(localStorage.getItem("bem_inventory_token")) ||
        Boolean(localStorage.getItem("token")) ||
        Boolean(localStorage.getItem("bem_user"))
      );
      if (!hasToken) {
        const redirectQuery = pathname && pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : "";
        router.replace(`/login${redirectQuery}`);
      }
    }
  }, [user, authChecking, router, pathname]);

  // If auth is still checking or no user yet, check if token/cookie exists
  if (authChecking || !user) {
    const hasTokenOrCookie = typeof window !== "undefined" && (
      document.cookie.includes("token") ||
      document.cookie.includes("bem_inventory_token") ||
      document.cookie.includes("bem_user") ||
      Boolean(localStorage.getItem("bem_inventory_token")) ||
      Boolean(localStorage.getItem("token")) ||
      Boolean(localStorage.getItem("bem_user"))
    );
    // If token exists, display the session check screen with 200 OK while hydrating, never redirect
    if (hasTokenOrCookie) {
      return <SessionCheckScreen />;
    }
    return <SessionCheckScreen />;
  }

  return (
    <InventoryProvider>
      <ProtectedShell>{children}</ProtectedShell>
    </InventoryProvider>
  );
}
