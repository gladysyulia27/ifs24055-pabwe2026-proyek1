"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { User } from "@/types";
import { getNavItems } from "@/constants/navigation";
import { getUserInitials, isDepartmentAdmin } from "@/utils/roles";

interface SidebarProps {
  user: User | null;
  pendingLoanCount: number;
  mobileNav: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

function SidebarUserCard({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="help-card sidebar-user-card">
      <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, color: "inherit", textDecoration: "none" }}>
        <div className="user-avatar">{getUserInitials(user)}</div>
        <div className="sidebar-user-copy">
          <b>{user.full_name}</b>
          <span>{isDepartmentAdmin(user) ? `Admin ${user.department_name}` : `NIM: ${user.identifier}`}</span>
        </div>
      </Link>
      <button type="button" className="logout-icon-btn" onClick={onLogout} title="Keluar" aria-label="Keluar">
        <LogOut size={16} />
      </button>
    </div>
  );
}

export function Sidebar({
  user,
  pendingLoanCount,
  mobileNav,
  onCloseMobile,
  onLogout
}: SidebarProps) {
  const pathname = usePathname();
  const showApprovalBadge = isDepartmentAdmin(user) && pendingLoanCount > 0;

  return (
    <>
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <Link href="/dashboard" className="brand-mark-box" style={{ textDecoration: "none" }}>
            <img src="/logo-bem-del.png" alt="BEM IT Del" className="brand-logo-img" />
          </Link>
          <div className="brand-titles">
            <strong>BEM IT Del</strong>
            <span>INVENTORI & PEMINJAMAN</span>
          </div>
        </div>

        <div className="nav-label">MENU UTAMA</div>
        {getNavItems(user).map(({ page, path, label, icon: Icon }) => {
          const isActive = pathname === path || (path !== "/dashboard" && pathname.startsWith(path));
          return (
            <Link
              key={page}
              href={path}
              onClick={onCloseMobile}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {page === "Peminjaman" && showApprovalBadge && <b className="nav-count">{pendingLoanCount}</b>}
            </Link>
          );
        })}

        <div className="sidebar-bottom">{user && <SidebarUserCard user={user} onLogout={onLogout} />}</div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={onCloseMobile} aria-label="Tutup menu" />}
    </>
  );
}
