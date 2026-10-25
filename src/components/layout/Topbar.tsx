"use client";

import React from "react";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { User } from "@/types";
import { getUserInitials, isDepartmentAdmin } from "@/utils/roles";

interface TopbarProps {
  pageTitle: string;
  user: User | null;
  hasNotifications: boolean;
  onToggleMobileNav: () => void;
}

export function Topbar({ pageTitle, user, hasNotifications, onToggleMobileNav }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-btn mobile-menu"
          onClick={onToggleMobileNav}
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
        <div className="crumb">
          BEM IT Del <span>/</span> <b>{pageTitle}</b>
        </div>
      </div>

      <div className="top-actions">
        <Link
          href="/notifications"
          className="icon-btn notification-btn link-plain"
          title="Notifikasi"
          aria-label="Buka notifikasi"
        >
          <Bell size={18} />
          {hasNotifications && <i />}
        </Link>

        {user && (
          <Link href="/profile" className="nav-link-profile">
            <div className="user-avatar">{getUserInitials(user)}</div>
            <div className="user-info">
              <b>{user.full_name}</b>
              <span>{isDepartmentAdmin(user) ? `Pengelola ${user.department_name}` : "Peminjam Mahasiswa"}</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
