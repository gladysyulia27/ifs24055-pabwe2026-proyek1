/**
 * InventoryContext — Thin composition root for data + UI state.
 *
 * Architecture (Separation of Concerns):
 *
 *   ┌─ InventoryProvider (this file) ─────────────────────────────┐
 *   │   Composes DataProvider → UIProvider                        │
 *   │   Re-exports useInventory() for full backward compatibility  │
 *   ├─ DataContext  (context/DataContext.tsx) ─────────────────────┤
 *   │   Single concern: fetched data state + refresh()            │
 *   │   departments, items, loans, calendar, notifications, etc.  │
 *   └─ UIContext    (context/UIContext.tsx) ──────────────────────┘
 *       Single concern: transient UI state + CRUD mutation handlers
 *       modals (item/loan/return/confirm/alert), toast, handlers
 */
"use client";

import React from "react";
import { DataProvider, DataContextType, useData } from "@/context/DataContext";
import { UIProvider, UIContextType, useUI, ConfirmDialogOptions, AlertDialogOptions } from "@/context/UIContext";

// Re-export option types so existing imports keep working
export type { ConfirmDialogOptions, AlertDialogOptions };

/** Combined shape exposed by useInventory() — union of Data + UI contexts. */
type InventoryContextValue = DataContextType & UIContextType;

/**
 * InventoryProvider — mounts DataProvider then UIProvider so that UIContext
 * can call `useData()` internally to access `refresh`.
 *
 * All existing page consumers use `useInventory()` unchanged.
 */
export function InventoryProvider({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <UIProvider>{children}</UIProvider>
    </DataProvider>
  );
}

/**
 * useInventory — Backward-compatible hook that merges DataContext and UIContext
 * into a single object, so no page component needs to change its import.
 */
export function useInventory(): InventoryContextValue {
  const data = useData();
  const ui = useUI();
  return { ...data, ...ui };
}
