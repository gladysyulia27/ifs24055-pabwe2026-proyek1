"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarView } from "@/components/views/CalendarView";
import { useInventory } from "@/context/InventoryContext";

export default function CalendarPage() {
  const router = useRouter();
  const { calendar } = useInventory();
  const [month, setMonth] = useState(new Date());

  return (
    <CalendarView
      month={month}
      calendarLoans={calendar}
      onPrevMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
      onNextMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
      onBackToDashboard={() => router.push("/dashboard")}
    />
  );
}
