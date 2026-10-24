"use client";

import { useRouter } from "next/navigation";
import { DashboardView } from "@/components/views/DashboardView";
import { useInventory } from "@/context/InventoryContext";

export default function DashboardPage() {
  const router = useRouter();
  const { departments, items, loans, loading } = useInventory();

  return (
    <DashboardView
      departments={departments}
      items={items}
      loans={loans}
      loading={loading}
      onNavigate={(page) => {
        if (page === "Inventori") router.push("/inventory");
        else if (page === "Peminjaman") router.push("/loans");
        else if (page === "Kalender") router.push("/calendar");
        else if (page === "Departemen") router.push("/departments");
      }}
      onSelectDepartment={(dept) => {
        router.push(`/inventory?dept=${encodeURIComponent(dept)}`);
      }}
    />
  );
}
