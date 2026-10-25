import { Item, ItemFormData, Loan, LoanAction, LoanFormData, User } from "@/types";
import { inventoryApi, loansApi } from "@/services/api";
import { ConfirmDialogOptions } from "@/context/UIContext";
import { useActionRunner } from "./useActionRunner";

interface UseInventoryMutationsOptions {
  user: User | null;
  editingItem: Item | null;
  runAction: ReturnType<typeof useActionRunner>;
  openConfirm: (options: ConfirmDialogOptions) => void;
}

export function useInventoryMutations({
  user,
  editingItem,
  runAction,
  openConfirm
}: UseInventoryMutationsOptions) {
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

  return {
    handleLoanSubmit,
    handleLoanAction,
    handleReturnSubmit,
    handleItemSubmit,
    handleDeleteItem
  };
}
