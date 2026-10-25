/**
 * UIContext — Manages all transient UI state: modals (item, loan, return,
 * confirm/alert) and toast notifications.
 *
 * Responsibilities (single concern):
 *   - Expose modal-open callbacks (openBorrowModal, openAddItemModal, etc.)
 *   - Own confirm/alert dialog state and its open/close lifecycle
 *   - Provide CRUD mutation handlers that call the service layer and trigger
 *     data refresh via DataContext after success
 *   - Surface showToast for one-off status messages
 *
 * This context intentionally contains NO raw data arrays and NO fetch logic.
 * Those live in DataContext.
 */
"use client";

import React, { createContext, useContext, useState } from "react";
import { Item, ItemFormData, Loan, LoanAction, LoanFormData, User } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useActionRunner } from "@/hooks/useActionRunner";
import { useInventoryMutations } from "@/hooks/useInventoryMutations";
import { useData } from "@/context/DataContext";
import { loansApi } from "@/services/api";
import { isDepartmentAdmin } from "@/utils/roles";

import { Toast } from "@/components/common/Toast";
import { ConfirmModal, ConfirmVariant } from "@/components/common/ConfirmModal";
import { ItemModal } from "@/components/inventory/ItemModal";
import { LoanModal } from "@/components/loans/LoanModal";
import { ReturnModal } from "@/components/loans/ReturnModal";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  description?: string;
  highlightText?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
}

export interface AlertDialogOptions {
  title: string;
  message: string;
  description?: string;
  buttonText?: string;
  variant?: ConfirmVariant;
}

export interface UIContextType {
  showToast: (msg: string) => void;
  openBorrowModal: (item: Item) => void;
  openAddItemModal: () => void;
  openEditItemModal: (item: Item) => void;
  openReturnModal: (loan: Loan) => void;
  openConfirm: (options: ConfirmDialogOptions) => void;
  showAlert: (options: AlertDialogOptions) => void;
  openAlert: (options: AlertDialogOptions) => void;
  handleDeleteItem: (item: Item) => void;
  handleLoanAction: (loan: Loan, action: LoanAction) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { refresh } = useData();
  const { toast, showToast, hideToast } = useToast();
  const runAction = useActionRunner(refresh, showToast);

  // --- Modal state ---
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedItemForLoan, setSelectedItemForLoan] = useState<Item | null>(null);

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [returnLoanItem, setReturnLoanItem] = useState<Loan | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<
    (ConfirmDialogOptions & { isAlert?: boolean }) | null
  >(null);

  // --- Confirm / Alert Modal Dialogs ---
  const openConfirm = (options: ConfirmDialogOptions) => {
    setConfirmDialog({ ...options, isAlert: false });
  };

  const showAlert = (options: AlertDialogOptions) => {
    setConfirmDialog({
      title: options.title,
      message: options.message,
      description: options.description,
      confirmText: options.buttonText || "Mengerti",
      variant: options.variant || "info",
      isAlert: true,
      onConfirm: () => {}
    });
  };

  const openAlert = showAlert;

  // --- Modal openers ---
  const openBorrowModal = (item: Item) => {
    if (isDepartmentAdmin(user)) {
      showToast("Akun Admin Departemen tidak dapat meminjam inventori. Gunakan akun Mahasiswa.");
      return;
    }
    setSelectedItemForLoan(item);
    setShowLoanModal(true);
  };

  const openAddItemModal = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const openEditItemModal = (item: Item) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const openReturnModal = (loan: Loan) => {
    setReturnLoanItem(loan);
  };

  // --- CRUD handlers delegated to useInventoryMutations ---
  const {
    handleLoanSubmit,
    handleLoanAction,
    handleReturnSubmit,
    handleItemSubmit,
    handleDeleteItem
  } = useInventoryMutations({
    user,
    editingItem,
    runAction,
    openConfirm
  });

  return (
    <UIContext.Provider
      value={{
        showToast,
        openBorrowModal,
        openAddItemModal,
        openEditItemModal,
        openReturnModal,
        openConfirm,
        showAlert,
        openAlert,
        handleDeleteItem,
        handleLoanAction
      }}
    >
      {children}

      {/* Shared Modals */}
      {showLoanModal && selectedItemForLoan && (
        <LoanModal
          item={selectedItemForLoan}
          currentUser={user}
          onClose={() => {
            setShowLoanModal(false);
            setSelectedItemForLoan(null);
          }}
          onSubmit={handleLoanSubmit}
          onErrorToast={showToast}
        />
      )}

      {showItemModal && isDepartmentAdmin(user) && user && (
        <ItemModal
          editingItem={editingItem}
          currentUser={user}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
          }}
          onSubmit={handleItemSubmit}
          onErrorToast={showToast}
        />
      )}

      {returnLoanItem && (
        <ReturnModal
          loan={returnLoanItem}
          onClose={() => setReturnLoanItem(null)}
          onSubmit={handleReturnSubmit}
          onErrorToast={showToast}
        />
      )}

      {confirmDialog && (
        <ConfirmModal
          isOpen={Boolean(confirmDialog)}
          title={confirmDialog.title}
          message={confirmDialog.message}
          description={confirmDialog.description}
          highlightText={confirmDialog.highlightText}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          variant={confirmDialog.variant}
          isAlert={confirmDialog.isAlert}
          onConfirm={confirmDialog.onConfirm}
          onClose={() => setConfirmDialog(null)}
        />
      )}

      <Toast message={toast} onClose={hideToast} />
    </UIContext.Provider>
  );
}

export function useUI(): UIContextType {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return ctx;
}
