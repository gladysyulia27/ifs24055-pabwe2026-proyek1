"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InventoryView } from "@/components/views/InventoryView";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/hooks/useAuth";
import { ALL_DEPARTMENTS } from "@/utils/inventory";

import { FALLBACK_AUDIT_USER } from "@/app/(protected)/layout";

function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const effectiveUser = user || FALLBACK_AUDIT_USER;
  const {
    departments,
    items,
    loading,
    openBorrowModal,
    openAddItemModal,
    openEditItemModal,
    handleDeleteItem
  } = useInventory();

  const [departmentFilter, setDepartmentFilter] = useState(ALL_DEPARTMENTS);

  useEffect(() => {
    const deptParam = searchParams.get("dept");
    if (deptParam) {
      setDepartmentFilter(deptParam);
    }
  }, [searchParams]);

  return (
    <InventoryView
      user={effectiveUser}
      departments={departments}
      items={items}
      loading={loading}
      departmentFilter={departmentFilter}
      onDepartmentFilterChange={setDepartmentFilter}
      onBack={() => router.push("/dashboard")}
      onBorrow={openBorrowModal}
      onAddItem={openAddItemModal}
      onEditItem={openEditItemModal}
      onDeleteItem={handleDeleteItem}
    />
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="loading-state">Memuat inventori...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
