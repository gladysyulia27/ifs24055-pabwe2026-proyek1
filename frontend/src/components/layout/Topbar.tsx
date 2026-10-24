"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import { PageKey, User } from "@/types";
import { getUserInitials, isDepartmentAdmin } from "@/utils/roles";

interface TopbarProps {
  page: PageKey;
  user: User | null;
  hasNotifications: boolean;
  onToggleMobileNav: () => void;
  onOpenNotifications: () => void;
}

export function Topbar({ page, user, hasNotifications, onToggleMobileNav, onOpenNotifications }: TopbarProps) {
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
          BEM IT Del <span>/</span> <b>{page}</b>
        </div>
      </div>

      <div className="top-actions">
        <button
          type="button"
          className="icon-btn notification-btn"
          onClick={onOpenNotifications}
          title="Notifikasi"
          aria-label="Buka notifikasi"
        >
          <Bell size={18} />
          {hasNotifications && <i />}
        </button>

        {user && (
          <>
            <div className="user-avatar">{getUserInitials(user)}</div>
            <div className="user-info">
              <b>{user.full_name}</b>
              <span>{isDepartmentAdmin(user) ? `Pengelola ${user.department_name}` : "Peminjam Mahasiswa"}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
