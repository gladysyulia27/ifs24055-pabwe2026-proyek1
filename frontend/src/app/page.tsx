"use client";

import React, { useState } from "react";
import { Item, ItemFormData, Loan, LoanAction, LoanFormData, PageKey } from "@/types";
import { DEFAULT_PAGE } from "@/constants/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useInventoryData } from "@/hooks/useInventoryData";
import { useToast } from "@/hooks/useToast";
import { useActionRunner } from "@/hooks/useActionRunner";
import { inventoryApi, loansApi } from "@/services/api";
import { ALL_DEPARTMENTS } from "@/utils/inventory";
import { isPendingLoan } from "@/utils/loans";
import { isDepartmentAdmin } from "@/utils/roles";

import { AuthForm } from "@/components/auth/AuthForm";
import { SessionCheckScreen } from "@/components/auth/SessionCheckScreen";
import { ApiErrorBanner } from "@/components/layout/ApiErrorBanner";
import { DepartmentAdminBanner } from "@/components/layout/DepartmentAdminBanner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toast } from "@/components/common/Toast";
import { ItemModal } from "@/components/inventory/ItemModal";
import { LoanModal } from "@/components/loans/LoanModal";
import { ReturnModal } from "@/components/loans/ReturnModal";

import { DashboardView } from "@/components/views/DashboardView";
import { InventoryView } from "@/components/views/InventoryView";
import { LoansView } from "@/components/views/LoansView";
import { CalendarView } from "@/components/views/CalendarView";
import { NotificationsView } from "@/components/views/NotificationsView";
import { DepartmentsView } from "@/components/views/DepartmentsView";

export default function Home() {
  const { user, authChecking, logout } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const { departments, items, loans, calendar, notifications, loading, error, refresh } =
    useInventoryData(user);

  const runAction = useActionRunner(refresh, showToast);

  const [page, setPage] = useState<PageKey>(DEFAULT_PAGE);
  const [filterDept, setFilterDept] = useState<string>(ALL_DEPARTMENTS);
  const [mobileNav, setMobileNav] = useState(false);
  const [month, setMonth] = useState(new Date());

  // Modal states
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedItemForLoan, setSelectedItemForLoan] = useState<Item | null>(null);

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [returnLoanItem, setReturnLoanItem] = useState<Loan | null>(null);

  // Navigation helpers
  const handleSelectDepartment = (deptName: string) => {
    setFilterDept(deptName);
    setPage("Inventori");
  };

  const handleBackToDashboard = () => setPage("Dashboard");

  // Inventory actions
  const handleBorrowClick = (item: Item) => {
    if (isDepartmentAdmin(user)) {
      showToast("Akun Admin Departemen tidak dapat meminjam inventori. Gunakan akun Mahasiswa.");
      return;
    }
    setSelectedItemForLoan(item);
    setShowLoanModal(true);
  };

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

    void runAction(() => loansApi.action(loan.id, action, approvedBy), {
      success: successMessages[action],
      fallbackError: "Aksi peminjaman gagal diproses."
    });
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
      department_id: Number(formData.department_id || user?.department_id),
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

  const handleItemDelete = (item: Item) => {
    if (!window.confirm(`Hapus barang: "${item.name}" dari inventori?`)) return;
    void runAction(() => inventoryApi.delete(item.id), {
      success: "Barang berhasil dihapus",
      fallbackError: "Gagal menghapus barang."
    });
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  // 1. Loading check
  if (authChecking) {
    return <SessionCheckScreen />;
  }

  // 2. Auth Gate View
  if (!user) {
    return (
      <>
        <AuthForm onSuccess={showToast} onErrorToast={showToast} />
        <Toast message={toast} onClose={hideToast} />
      </>
    );
  }

  const pendingLoanCount = loans.filter(isPendingLoan).length;
  const hasNotifications = notifications.pending.length > 0;

  // 3. Authenticated Dashboard View
  return (
    <div className="app-shell">
      <Sidebar
        currentPage={page}
        user={user}
        pendingLoanCount={pendingLoanCount}
        mobileNav={mobileNav}
        onPageChange={setPage}
        onCloseMobile={() => setMobileNav(false)}
        onLogout={logout}
      />

      <main className="main-area">
        <Topbar
          page={page}
          user={user}
          hasNotifications={hasNotifications}
          onToggleMobileNav={() => setMobileNav(!mobileNav)}
          onOpenNotifications={() => setPage("Notifikasi")}
        />

        <div className="content">
          {error && <ApiErrorBanner message={error} onRetry={() => void refresh()} />}

          {isDepartmentAdmin(user) && (
            <DepartmentAdminBanner user={user} onAddItem={handleOpenAddItem} />
          )}

          {page === "Dashboard" && (
            <DashboardView
              departments={departments}
              items={items}
              loans={loans}
              loading={loading}
              onNavigate={setPage}
              onSelectDepartment={handleSelectDepartment}
            />
          )}

          {page === "Inventori" && (
            <InventoryView
              user={user}
              departments={departments}
              items={items}
              loading={loading}
              departmentFilter={filterDept}
              onDepartmentFilterChange={setFilterDept}
              onBack={handleBackToDashboard}
              onBorrow={handleBorrowClick}
              onAddItem={handleOpenAddItem}
              onEditItem={(item) => {
                setEditingItem(item);
                setShowItemModal(true);
              }}
              onDeleteItem={handleItemDelete}
            />
          )}

          {page === "Peminjaman" && (
            <LoansView
              user={user}
              loans={loans}
              loading={loading}
              onBack={handleBackToDashboard}
              onOpenCalendar={() => setPage("Kalender")}
              onAction={handleLoanAction}
              onOpenReturn={(loan) => setReturnLoanItem(loan)}
            />
          )}

          {page === "Kalender" && (
            <CalendarView
              month={month}
              calendarLoans={calendar}
              onPrevMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              onNextMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              onBackToDashboard={handleBackToDashboard}
            />
          )}

          {page === "Notifikasi" && (
            <NotificationsView user={user} notifications={notifications} onBack={handleBackToDashboard} />
          )}

          {page === "Departemen" && (
            <DepartmentsView
              user={user}
              departments={departments}
              items={items}
              onBack={handleBackToDashboard}
              onSelectDepartment={handleSelectDepartment}
            />
          )}
        </div>

        <footer className="footer">
          <div>
            <b>BEM IT Del</b>
            <span>Sistem Manajemen Peminjaman Inventori</span>
          </div>
          <span>“Satu Sistem, Semua Inventori, Kegiatan Lebih Baik.”</span>
          <span className="footer-tech">Next.js · Express · SQLite</span>
        </footer>
      </main>

      {/* Modals */}
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

      {showItemModal && isDepartmentAdmin(user) && (
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

      <Toast message={toast} onClose={hideToast} />
    </div>
  );
}
