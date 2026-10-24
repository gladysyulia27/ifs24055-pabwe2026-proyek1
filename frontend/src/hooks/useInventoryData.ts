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
      const [depts, inv, lns, cal, notifs] = await Promise.all([
        departmentsApi.getAll(),
        inventoryApi.getAll(),
        loansApi.getAll(),
        loansApi.getCalendar(),
        notificationsApi.getNotifications()
      ]);
      setDepartments(depts);
      setItems(inv);
      setLoans(lns);
      setCalendar(cal);
      setNotifications(notifs);
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
