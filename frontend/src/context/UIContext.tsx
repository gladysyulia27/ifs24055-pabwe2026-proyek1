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
import { useData } from "@/context/DataContext";
import { inventoryApi, loansApi } from "@/services/api";
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

  // --- Confirm / Alert ---
  const openConfirm = (options: ConfirmDialogOptions) => {
    setConfirmDialog({ ...options, isAlert: false });
  };

  const openAlert = (options: AlertDialogOptions) => {
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

  // --- CRUD handlers ---
  const handleLoanSubmit = async (formData: LoanFormData, item: Item) => {
    await runAction(
      () =>
        loansApi.create({
          inventory_id: item.id,
          borrower_name: formData.borrower_name,
          borrower_id: formData.borrower_id,
          borrower_contact: formData.borrower_contact,
          organization: formData.organization,
          purpose: formData.purpose,
          quantity: Number(formData.quantity),
          start_date: formData.start_date,
          due_date: formData.due_date
        }),
      {
        success: "Pengajuan peminjaman berhasil dikirim ke penanggung jawab departemen",
        fallbackError: "Gagal mengajukan peminjaman.",
        rethrow: true
      }
    );
  };

  const handleLoanAction = (loan: Loan, action: LoanAction) => {
    const approvedBy = user ? `${user.full_name} (${user.department_name})` : undefined;
    const successMessages: Record<LoanAction, string> = {
      approve: "Peminjaman berhasil disetujui",
      reject: "Pengajuan peminjaman ditolak",
      "confirm-return": "Pengembalian barang telah dikonfirmasi"
    };

    const executeAction = () => {
      void runAction(() => loansApi.action(loan.id, action, approvedBy), {
        success: successMessages[action],
        fallbackError: "Aksi peminjaman gagal diproses."
      });
    };

    if (action === "reject") {
      openConfirm({
        title: "Tolak Pengajuan Peminjaman",
        message: `Apakah Anda yakin ingin menolak permohonan peminjaman "${loan.inventory_name}"?`,
        highlightText: `Peminjam: ${loan.borrower_name} (${loan.organization}) · ${loan.quantity} unit`,
        description: "Pengajuan ini akan diberi tanda status 'Ditolak' dan peminjam tidak dapat mengambil barang.",
        confirmText: "Ya, Tolak Pengajuan",
        cancelText: "Batal",
        variant: "danger",
        onConfirm: executeAction
      });
      return;
    }

    if (action === "confirm-return") {
      openConfirm({
        title: "Konfirmasi Pengembalian Barang",
        message: `Konfirmasi bahwa barang "${loan.inventory_name}" telah dikembalikan?`,
        highlightText: `Jumlah: ${loan.quantity} unit · Peminjam: ${loan.borrower_name}`,
        description: "Stok inventori barang ini akan otomatis dikembalikan ke sistem.",
        confirmText: "Ya, Konfirmasi Kembali",
        cancelText: "Batal",
        variant: "info",
        onConfirm: executeAction
      });
      return;
    }

    executeAction();
  };

  const handleReturnSubmit = async (loanId: number, proofUrl: string, note?: string) => {
    await runAction(() => loansApi.submitReturn(loanId, proofUrl, note), {
      success: "Bukti pengembalian terkirim. Menunggu konfirmasi pengelola departemen.",
      fallbackError: "Gagal mengirim bukti pengembalian.",
      rethrow: true
    });
  };

  const handleItemSubmit = async (formData: ItemFormData) => {
    const payload = {
      department_id: Number(formData.department_id || (user as User & { department_id: number | null })?.department_id),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      total_stock: Number(formData.total_stock),
      condition_status: formData.condition_status,
      image_url: formData.image_url
    };

    const action = editingItem
      ? () => inventoryApi.update(editingItem.id, payload)
      : () => inventoryApi.create(payload);

    await runAction(action, {
      success: editingItem ? "Inventori berhasil diperbarui" : "Inventori berhasil ditambahkan",
      fallbackError: "Gagal menyimpan inventori.",
      rethrow: true
    });
  };

  const handleDeleteItem = (item: Item) => {
    openConfirm({
      title: "Hapus Barang Inventori",
      message: `Apakah Anda yakin ingin menghapus "${item.name}" dari inventori?`,
      highlightText: `${item.name} (${item.department_name})`,
      description: "Data barang ini akan dihapus secara permanen dari daftar inventori departemen Anda.",
      confirmText: "Ya, Hapus Barang",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: async () => {
        await runAction(() => inventoryApi.delete(item.id), {
          success: `Barang "${item.name}" berhasil dihapus`,
          fallbackError: "Gagal menghapus barang."
        });
      }
    });
  };

  return (
    <UIContext.Provider
      value={{
        showToast,
        openBorrowModal,
        openAddItemModal,
        openEditItemModal,
        openReturnModal,
        openConfirm,
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
