"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileView } from "@/components/views/ProfileView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { loans, openConfirm } = useInventory();

  if (!user) return null;

  const userLoans = loans.filter((loan) => loan.borrower_id === user.identifier || loan.user_id === user.id);

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
      user={user}
      userLoans={userLoans}
      onBack={() => router.push("/dashboard")}
      onLogout={handleLogout}
    />
  );
}
