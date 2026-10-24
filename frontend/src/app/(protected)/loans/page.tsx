"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoansView } from "@/components/views/LoansView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";

export default function LoansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { loans, loading, handleLoanAction, openReturnModal } = useInventory();

  if (!user) return null;

  return (
    <LoansView
      user={user}
      loans={loans}
      loading={loading}
      onBack={() => router.push("/dashboard")}
      onOpenCalendar={() => router.push("/calendar")}
      onAction={handleLoanAction}
      onOpenReturn={openReturnModal}
    />
  );
}
