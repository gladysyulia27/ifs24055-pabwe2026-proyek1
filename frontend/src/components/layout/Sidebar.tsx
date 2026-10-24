"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { PageKey, User } from "@/types";
import { getNavItems } from "@/constants/navigation";
import { getUserInitials, isDepartmentAdmin } from "@/utils/roles";

interface SidebarProps {
  currentPage: PageKey;
  user: User | null;
  pendingLoanCount: number;
  mobileNav: boolean;
  onPageChange: (page: PageKey) => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

function SidebarUserCard({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="help-card sidebar-user-card">
      <div className="user-avatar">{getUserInitials(user)}</div>
      <div className="sidebar-user-copy">
        <b>{user.full_name}</b>
        <span>{isDepartmentAdmin(user) ? `Admin ${user.department_name}` : `NIM: ${user.identifier}`}</span>
      </div>
      <button type="button" className="logout-icon-btn" onClick={onLogout} title="Keluar" aria-label="Keluar">
        <LogOut size={16} />
      </button>
    </div>
  );
}

export function Sidebar({
  currentPage,
  user,
  pendingLoanCount,
  mobileNav,
  onPageChange,
  onCloseMobile,
  onLogout
}: SidebarProps) {
  const showApprovalBadge = isDepartmentAdmin(user) && pendingLoanCount > 0;

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
        {getNavItems(user).map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            type="button"
            onClick={() => {
              onPageChange(page);
              onCloseMobile();
            }}
            className={`nav-link ${currentPage === page ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {page === "Peminjaman" && showApprovalBadge && <b className="nav-count">{pendingLoanCount}</b>}
          </button>
        ))}

        <div className="sidebar-bottom">{user && <SidebarUserCard user={user} onLogout={onLogout} />}</div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={onCloseMobile} aria-label="Tutup menu" />}
    </>
  );
}
