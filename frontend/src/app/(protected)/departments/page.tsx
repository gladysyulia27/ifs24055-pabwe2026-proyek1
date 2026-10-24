"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DepartmentsView } from "@/components/views/DepartmentsView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";

export default function DepartmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { departments, items } = useInventory();

  if (!user) return null;

  return (
    <DepartmentsView
      user={user}
      departments={departments}
      items={items}
      onBack={() => router.push("/dashboard")}
      onSelectDepartment={(deptName) => router.push(`/inventory?dept=${encodeURIComponent(deptName)}`)}
    />
  );
}
