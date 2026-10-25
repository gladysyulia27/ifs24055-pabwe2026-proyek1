"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DepartmentsView } from "@/components/views/DepartmentsView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";
import { FALLBACK_AUDIT_USER } from "@/app/(protected)/layout";

export default function DepartmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const effectiveUser = user || FALLBACK_AUDIT_USER;
  const { departments, items } = useInventory();

  return (
    <DepartmentsView
      user={effectiveUser}
      departments={departments}
      items={items}
      onBack={() => router.push("/dashboard")}
      onSelectDepartment={(deptName) => router.push(`/inventory?dept=${encodeURIComponent(deptName)}`)}
    />
  );
}
