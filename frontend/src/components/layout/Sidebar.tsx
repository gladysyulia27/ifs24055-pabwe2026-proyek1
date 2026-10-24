"use client";

import React from "react";
import {
  Boxes,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  LucideIcon
} from "lucide-react";
import { User, NotificationsData, Loan } from "@/types";

interface NavItemDef {
  name: string;
  icon: LucideIcon;
  pageKey?: string;
}

interface SidebarProps {
  currentPage: string;
  user: User | null;
  notifications: NotificationsData;
  pendingLoans: Loan[];
  mobileNav: boolean;
  onPageChange: (page: string) => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export function Sidebar({
  currentPage,
  user,
  notifications,
  pendingLoans,
  mobileNav,
  onPageChange,
  onCloseMobile,
  onLogout
}: SidebarProps) {
  const navItems: NavItemDef[] = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Inventori", icon: Package },
    {
      name: user?.role === "admin_departemen" ? "Persetujuan Peminjaman" : "Peminjaman Saya",
      icon: ClipboardList,
      pageKey: "Peminjaman"
    },
    { name: "Kalender", icon: CalendarDays },
    { name: "Departemen", icon: Boxes }
  ];

  return (
    <>
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark-box">
            <img src="/logo-bem-del.png" alt="BEM IT Del" className="brand-logo-img" />
          </div>
          <div className="brand-titles">
            <strong>BEM IT Del</strong>
            <span>INVENTORI & PEMINJAMAN</span>
          </div>
        </div>

        <div className="nav-label">MENU UTAMA</div>
        {navItems.map((n) => {
          const targetPage = n.pageKey || n.name;
          const isActive = currentPage === targetPage;
          return (
            <button
              key={n.name}
              type="button"
              onClick={() => {
                onPageChange(targetPage);
                onCloseMobile();
              }}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <n.icon size={18} />
              <span>{n.name}</span>
              {targetPage === "Notifikasi" && notifications.pending.length > 0 && (
                <b className="nav-count">{notifications.pending.length}</b>
              )}
              {targetPage === "Peminjaman" && user?.role === "admin_departemen" && pendingLoans.length > 0 && (
                <b className="nav-count">{pendingLoans.length}</b>
              )}
            </button>
          );
        })}

        <div className="sidebar-bottom">
          {user && (
            <div className="help-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
              <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 13, flexShrink: 0 }}>
                {user.role === "admin_departemen" ? "PJ" : "M"}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <b style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", display: "block" }}>
                  {user.full_name}
                </b>
                <span style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {user.role === "admin_departemen" ? `Admin ${user.department_name}` : `NIM: ${user.identifier}`}
                </span>
              </div>
              <button
                type="button"
                className="logout-icon-btn"
                onClick={onLogout}
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={onCloseMobile} aria-label="Tutup menu" />}
    </>
  );
}
