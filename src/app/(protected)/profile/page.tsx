"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileView } from "@/components/views/ProfileView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";
import { FALLBACK_AUDIT_USER } from "@/app/(protected)/layout";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const effectiveUser = user || FALLBACK_AUDIT_USER;
  const { loans, openConfirm } = useInventory();

  const userLoans = loans.filter((loan) => loan.borrower_id === effectiveUser.identifier || loan.user_id === effectiveUser.id);

  const handleLogout = () => {
    openConfirm({
      title: "Konfirmasi Keluar Akun",
      message: "Apakah Anda yakin ingin keluar dari akun Sistem Inventori BEM IT Del?",
      confirmText: "Ya, Keluar",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: async () => {
        await logout();
        router.push("/login");
      }
    });
  };

  return (
    <ProfileView
      user={effectiveUser}
      userLoans={userLoans}
      onBack={() => router.push("/dashboard")}
      onLogout={handleLogout}
    />
  );
}
