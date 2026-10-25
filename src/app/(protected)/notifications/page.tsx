"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NotificationsView } from "@/components/views/NotificationsView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notifications } = useInventory();

  if (!user) return null;

  return (
    <NotificationsView
      user={user}
      notifications={notifications}
      onBack={() => router.push("/dashboard")}
    />
  );
}
