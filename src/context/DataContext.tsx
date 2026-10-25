/**
 * DataContext — Provides raw inventory data (departments, items, loans, etc.)
 * and a `refresh()` trigger to all child components.
 *
 * Responsibilities (single concern):
 *   - Fetch and cache all collection data via `useInventoryData`
 *   - Expose a typed `refresh()` function for refetching after mutations
 *   - Surface `loading` and `error` state for UI feedback
 *
 * This context intentionally contains NO modal state, NO CRUD handlers,
 * and NO toast logic. Those live in UIContext.
 */
"use client";

import React, { createContext, useContext } from "react";
import { Department, Item, Loan, NotificationsData } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useInventoryData } from "@/hooks/useInventoryData";

export interface DataContextType {
  departments: Department[];
  items: Item[];
  loans: Loan[];
  calendar: Loan[];
  notifications: NotificationsData;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const data = useInventoryData(user);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
