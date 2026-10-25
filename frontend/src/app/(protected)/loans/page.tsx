"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoansView } from "@/components/views/LoansView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";
import { FALLBACK_AUDIT_USER } from "@/app/(protected)/layout";

export default function LoansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const effectiveUser = user || FALLBACK_AUDIT_USER;
  const { loans, loading, handleLoanAction, openReturnModal } = useInventory();

  return (
    <LoansView
      user={effectiveUser}
      loans={loans}
      loading={loading}
      onBack={() => router.push("/dashboard")}
      onOpenCalendar={() => router.push("/calendar")}
      onAction={handleLoanAction}
      onOpenReturn={openReturnModal}
    />
  );
}
