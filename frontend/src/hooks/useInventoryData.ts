"use client";

import { useCallback, useEffect, useState } from "react";
import { Department, Item, Loan, NotificationsData, User } from "@/types";
import { departmentsApi, inventoryApi, loansApi, notificationsApi } from "@/services/api";
import { getErrorMessage } from "@/utils/errors";

const EMPTY_NOTIFICATIONS: NotificationsData = { due_returns: [], pending: [] };

/** Loads every collection the dashboard needs from the backend API and exposes a refresh function. */
export function useInventoryData(user: User | null) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [calendar, setCalendar] = useState<Loan[]>([]);
  const [notifications, setNotifications] = useState<NotificationsData>(EMPTY_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const results = await Promise.allSettled([
        departmentsApi.getAll(),
        inventoryApi.getAll(),
        loansApi.getAll(),
        loansApi.getCalendar(),
        notificationsApi.getNotifications()
      ]);

      const [deptRes, invRes, loanRes, calRes, notifRes] = results;

      if (deptRes.status === "fulfilled") setDepartments(deptRes.value);
      if (invRes.status === "fulfilled") setItems(invRes.value);
      if (loanRes.status === "fulfilled") setLoans(loanRes.value);
      if (calRes.status === "fulfilled") setCalendar(calRes.value);
      if (notifRes.status === "fulfilled") setNotifications(notifRes.value);

      // Jika inventori dan departemen gagal total, tampilkan pesan error
      if (invRes.status === "rejected" && deptRes.status === "rejected") {
        setError(getErrorMessage(invRes.reason, "Gagal memuat data inventori dari server backend."));
      } else {
        setError("");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Gagal memuat data dari server backend."));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { departments, items, loans, calendar, notifications, loading, error, refresh };
}
