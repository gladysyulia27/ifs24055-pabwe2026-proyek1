"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  Plus,
  ArrowDownToLine,
  Search,
  SlidersHorizontal,
  Bell,
  ClipboardList,
  X,
  ArrowLeft
} from "lucide-react";

import { Department, Item, Loan, ItemFormData, LoanFormData, NotificationsData } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { inventoryApi, departmentsApi, loansApi, notificationsApi } from "@/services/api";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthForm } from "@/components/auth/AuthForm";
import { StatCard } from "@/components/dashboard/StatCard";
import { ItemCard } from "@/components/inventory/ItemCard";
import { ItemModal } from "@/components/inventory/ItemModal";
import { LoanTable } from "@/components/loans/LoanTable";
import { LoanModal } from "@/components/loans/LoanModal";
import { ReturnModal } from "@/components/loans/ReturnModal";
import { CalendarView } from "@/components/calendar/CalendarView";
import { StatSkeleton, ItemCardSkeleton } from "@/components/common/LoadingSkeleton";
import { departmentColor, getDepartmentIcon } from "@/utils/departmentStyles";

export default function Home() {
  const { user, authChecking, logout } = useAuth();

  const [page, setPage] = useState("Dashboard");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [calendar, setCalendar] = useState<Loan[]>([]);
  const [notifications, setNotifications] = useState<NotificationsData>({ due_returns: [], pending: [] });

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("Semua Departemen");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [month, setMonth] = useState(new Date());

  // Modal states
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedItemForLoan, setSelectedItemForLoan] = useState<Item | null>(null);

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [returnLoanItem, setReturnLoanItem] = useState<Loan | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3500);
  }, []);

  const refreshData = useCallback(async () => {
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
      setError(err instanceof Error ? err.message : "Gagal memuat data dari server backend.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      void refreshData();
    }
  }, [user, refreshData]);

  // Derived Metrics
  const totalStock = useMemo(() => items.reduce((n, i) => n + i.total_stock, 0), [items]);
  const availableStock = useMemo(() => items.reduce((n, i) => n + i.available_stock, 0), [items]);
  const activeLoans = useMemo(
    () => loans.filter((l) => l.status === "Disetujui" || l.status === "Menunggu Konfirmasi Pengembalian"),
    [loans]
  );
  const pendingLoans = useMemo(() => loans.filter((l) => l.status === "Menunggu Approval"), [loans]);

  const visibleItems = useMemo(() => {
    return items.filter((i) => {
      const matchesDept = filterDept === "Semua Departemen" || i.department_name === filterDept;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.department_name.toLowerCase().includes(q);
      return matchesDept && matchesSearch;
    });
  }, [items, filterDept, search]);

  // Handlers
  const handleBorrowClick = (item: Item) => {
    if (user?.role === "admin_departemen") {
      showToast("Akun Admin Departemen tidak dapat meminjam inventori. Gunakan akun Mahasiswa.");
      return;
    }
    setSelectedItemForLoan(item);
    setShowLoanModal(true);
  };

  const handleLoanSubmit = async (formData: LoanFormData, item: Item) => {
    try {
      await loansApi.create({
        inventory_id: item.id,
        borrower_name: formData.borrower_name,
        borrower_id: formData.borrower_id,
        borrower_contact: formData.borrower_contact,
        organization: formData.organization,
        purpose: formData.purpose,
        quantity: Number(formData.quantity),
        start_date: formData.start_date,
        due_date: formData.due_date
      });
      await refreshData();
      showToast("Pengajuan peminjaman berhasil dikirim ke penanggung jawab departemen");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengajukan peminjaman.");
      throw err;
    }
  };

  const handleLoanAction = async (loan: Loan, action: "approve" | "reject" | "confirm-return") => {
    try {
      const approvedBy = user ? `${user.full_name} (${user.department_name})` : undefined;
      await loansApi.action(loan.id, action, approvedBy);
      await refreshData();
      showToast(
        action === "approve"
          ? "Peminjaman berhasil disetujui"
          : action === "reject"
          ? "Pengajuan peminjaman ditolak"
          : "Pengembalian barang telah dikonfirmasi"
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Aksi peminjaman gagal diproses.");
    }
  };

  const handleReturnSubmit = async (loanId: number, proofUrl: string, note?: string) => {
    try {
      await loansApi.submitReturn(loanId, proofUrl, note);
      await refreshData();
      showToast("Bukti pengembalian terkirim. Menunggu konfirmasi pengelola departemen.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengirim bukti pengembalian.");
      throw err;
    }
  };

  const handleItemSubmit = async (formData: ItemFormData) => {
    try {
      const payload = {
        department_id: Number(formData.department_id || user?.department_id),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        total_stock: Number(formData.total_stock),
        condition_status: formData.condition_status,
        image_url: formData.image_url
      };

      if (editingItem) {
        await inventoryApi.update(editingItem.id, payload);
        showToast("Inventori berhasil diperbarui");
      } else {
        await inventoryApi.create(payload);
        showToast("Inventori berhasil ditambahkan");
      }
      await refreshData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan inventori.");
      throw err;
    }
  };

  const handleItemDelete = async (item: Item) => {
    if (!window.confirm(`Hapus barang: "${item.name}" dari inventori?`)) return;
    try {
      await inventoryApi.delete(item.id);
      await refreshData();
      showToast("Barang berhasil dihapus");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus barang.");
    }
  };

  // 1. Loading check
  if (authChecking) {
    return (
      <div className="auth-gate-page" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <img src="/logo-bem-del.png?v=2" alt="Logo BEM IT Del" style={{ height: 68, objectFit: "contain" }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", margin: 0, fontSize: 20, color: "var(--ink)" }}>BEM Institut Teknologi Del</h2>
            <p style={{ color: "var(--ink-secondary)", fontSize: 13, margin: "4px 0 0" }}>Memeriksa sesi login...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Auth Gate View
  if (!user) {
    return (
      <>
        <AuthForm onSuccess={(msg) => showToast(msg)} onErrorToast={(msg) => showToast(msg)} />
        {toast && (
          <div className="toast">
            <CheckCircle2 size={18} />
            {toast}
            <button type="button" onClick={() => setToast("")} aria-label="Tutup notifikasi">
              <X size={15} />
            </button>
          </div>
        )}
      </>
    );
  }

  // 3. Authenticated Dashboard View
  return (
    <div className="app-shell">
      <Sidebar
        currentPage={page}
        user={user}
        notifications={notifications}
        pendingLoans={pendingLoans}
        mobileNav={mobileNav}
        onPageChange={(p) => setPage(p)}
        onCloseMobile={() => setMobileNav(false)}
        onLogout={logout}
      />

      <main className="main-area">
        <Topbar
          page={page}
          user={user}
          notifications={notifications}
          onToggleMobileNav={() => setMobileNav(!mobileNav)}
          onOpenNotifications={() => setPage("Notifikasi")}
        />

        <div className="content">
          {error && (
            <div className="error-banner">
              <Activity size={18} />
              <div>
                <b>API belum tersambung</b>
                <span>{error}. Pastikan backend Express aktif di <code>localhost:4000</code>.</span>
              </div>
              <button type="button" onClick={() => void refreshData()} className="btn btn-small">
                Coba lagi
              </button>
            </div>
          )}

          {/* Department Admin Banner */}
          {user.role === "admin_departemen" && (
            <div className="dept-admin-banner">
              <div className="dept-admin-banner-left">
                <div className="dept-admin-badge">PENGELOLA INVENTORI</div>
                <div>
                  <h3>Departemen {user.department_name}</h3>
                  <p>Anda memiliki hak akses untuk menambah, memperbarui stok, serta menyetujui peminjaman barang departemen ini.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-accent btn-small"
                onClick={() => {
                  setEditingItem(null);
                  setShowItemModal(true);
                }}
              >
                <Plus size={15} /> Tambah Inventori {user.department_name}
              </button>
            </div>
          )}

          {/* DASHBOARD PAGE */}
          {page === "Dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">OVERVIEW ORGANISASI</div>
                  <h1>Dashboard Inventori</h1>
                  <p>Pantau ketersediaan barang dan aktivitas peminjaman BEM IT Del.</p>
                </div>
                <button type="button" className="btn btn-accent" onClick={() => setPage("Inventori")}>
                  <Package size={17} /> Jelajahi inventori <ArrowRight size={16} />
                </button>
              </div>

              {loading ? (
                <div className="stats-grid">
                  <StatSkeleton />
                  <StatSkeleton />
                  <StatSkeleton />
                  <StatSkeleton />
                </div>
              ) : (
                <div className="stats-grid">
                  <StatCard
                    icon={<Package size={20} />}
                    label="Total Inventori"
                    value={totalStock}
                    sub={`${items.length} jenis barang`}
                    color="blue"
                  />
                  <StatCard
                    icon={<ArrowDownToLine size={20} />}
                    label="Sedang Dipinjam"
                    value={activeLoans.reduce((n, l) => n + l.quantity, 0)}
                    sub={`${activeLoans.length} transaksi aktif`}
                    color="pink"
                  />
                  <StatCard
                    icon={<CheckCircle2 size={20} />}
                    label="Barang Tersedia"
                    value={availableStock}
                    sub="Siap dipinjam"
                    color="green"
                  />
                  <StatCard
                    icon={<Clock3 size={20} />}
                    label="Menunggu Approval"
                    value={pendingLoans.length}
                    sub="Perlu ditinjau"
                    color="yellow"
                  />
                </div>
              )}

              <div className="dashboard-grid">
                <section className="panel department-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Inventori per Departemen</h2>
                      <p>Ringkasan kepemilikan barang</p>
                    </div>
                    <button type="button" className="text-btn" onClick={() => setPage("Departemen")}>
                      Lihat semua <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="dept-list">
                    {departments.map((d) => {
                      const deptItems = items.filter((i) => i.department_id === d.id);
                      const totalUnits = deptItems.reduce((n, i) => n + i.total_stock, 0);
                      const DIcon = getDepartmentIcon(d.name);
                      return (
                        <div
                          className="dept-row"
                          key={d.id}
                          onClick={() => {
                            setFilterDept(d.name);
                            setPage("Inventori");
                          }}
                        >
                          <div className={`dept-badge ${departmentColor[d.name] || "blue"}`}>
                            <DIcon size={18} />
                          </div>
                          <div className="dept-name">
                            <b>{d.name}</b>
                            <span>{deptItems.length} jenis barang</span>
                          </div>
                          <div className="dept-total">{totalUnits} unit</div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h2>Aktivitas Terbaru</h2>
                      <p>Peminjaman terkini</p>
                    </div>
                    <button type="button" className="text-btn" onClick={() => setPage("Peminjaman")}>
                      Semua transaksi <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="activity-list">
                    {loans.length === 0 ? (
                      <div className="empty-state">
                        <div><Package size={22} /></div>
                        <span>Belum ada transaksi peminjaman.</span>
                      </div>
                    ) : (
                      loans.slice(0, 5).map((l) => (
                        <div className="activity-row" key={l.id}>
                          <div className="activity-copy">
                            <b>{l.borrower_name}</b>
                            <span>
                              Meminjam {l.quantity} unit <em>{l.inventory_name}</em> ({l.department_name})
                            </span>
                          </div>
                          <span className={`status ${l.status === "Disetujui" ? "status-green" : "status-amber"}`}>
                            {l.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* INVENTORY CATALOG PAGE */}
          {page === "Inventori" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="page-heading-action">
                    <button type="button" className="page-back-btn" onClick={() => setPage("Dashboard")} title="Kembali ke Dashboard">
                      <ArrowLeft size={15} /> Kembali ke Dashboard
                    </button>
                    <span className="eyebrow">KATALOG BARANG</span>
                  </div>
                  <h1>Inventori Departemen</h1>
                  <p>Temukan barang inventori dan ajukan peminjaman sesuai kebutuhan kegiatan.</p>
                </div>
                {user.role === "admin_departemen" && (
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={() => {
                      setEditingItem(null);
                      setShowItemModal(true);
                    }}
                  >
                    <Plus size={16} /> Tambah Inventori {user.department_name}
                  </button>
                )}
              </div>

              <div className="filters-bar">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama barang, kategori..."
                  />
                </div>
                <div className="filter-dept-wrap">
                  <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                    <option>Semua Departemen</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-count">{visibleItems.length} barang</div>
              </div>

              {loading ? (
                <div className="items-grid">
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                </div>
              ) : visibleItems.length === 0 ? (
                <div className="empty-state">
                  <div><Package size={22} /></div>
                  <span>Tidak ada barang yang cocok dengan kriteria pencarian.</span>
                </div>
              ) : (
                <div className="items-grid">
                  {visibleItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      currentUser={user}
                      onBorrow={handleBorrowClick}
                      onEdit={(it) => {
                        setEditingItem(it);
                        setShowItemModal(true);
                      }}
                      onDelete={handleItemDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* LOANS / TRANSACTIONS PAGE */}
          {page === "Peminjaman" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="page-heading-action">
                    <button type="button" className="page-back-btn" onClick={() => setPage("Dashboard")} title="Kembali ke Dashboard">
                      <ArrowLeft size={15} /> Kembali ke Dashboard
                    </button>
                    <span className="eyebrow">
                      {user.role === "admin_departemen" ? "PANEL PERSETUJUAN" : "STATUS PEMINJAMAN"}
                    </span>
                  </div>
                  <h1>
                    {user.role === "admin_departemen"
                      ? `Persetujuan Peminjaman Departemen ${user.department_name}`
                      : "Peminjaman Saya"}
                  </h1>
                  <p>
                    {user.role === "admin_departemen"
                      ? "Kelola dan verifikasi permohonan peminjaman inventori departemen Anda."
                      : "Pantau riwayat permohonan peminjaman serta status persetujuan dari pengelola."}
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => setPage("Kalender")}>
                  Lihat di kalender <ArrowRight size={15} />
                </button>
              </div>

              <LoanTable
                loans={loans}
                currentUser={user}
                loading={loading}
                onAction={handleLoanAction}
                onOpenReturn={(loan) => setReturnLoanItem(loan)}
              />
            </>
          )}

          {/* CALENDAR PAGE */}
          {page === "Kalender" && (
            <CalendarView
              month={month}
              calendarLoans={calendar}
              onPrevMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              onNextMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              onBackToDashboard={() => setPage("Dashboard")}
            />
          )}

          {/* NOTIFICATIONS PAGE */}
          {page === "Notifikasi" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="page-heading-action">
                    <button type="button" className="page-back-btn" onClick={() => setPage("Dashboard")} title="Kembali ke Dashboard">
                      <ArrowLeft size={15} /> Kembali ke Dashboard
                    </button>
                    <span className="eyebrow">PEMBERITAHUAN</span>
                  </div>
                  <h1>Notifikasi {user?.role === "admin_departemen" ? `Departemen ${user.department_name}` : ""}</h1>
                  <p>Pengajuan baru, pengembalian yang menunggu, dan pengingat jatuh tempo.</p>
                </div>
              </div>

              <div className="notification-columns">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h2>Perlu ditindaklanjuti</h2>
                      <p>{notifications.pending.length} pemberitahuan</p>
                    </div>
                    <Bell size={18} style={{ color: "var(--ink-muted)" }} />
                  </div>
                  {notifications.pending.length === 0 ? (
                    <div className="empty-state">
                      <div><Package size={22} /></div>
                      <span>Tidak ada pemberitahuan baru.</span>
                    </div>
                  ) : (
                    notifications.pending.map((n, i) => (
                      <div className="notice-row" key={`${n.id}-${i}`}>
                        <div className="notice-icon"><ClipboardList size={18} /></div>
                        <div>
                          <b>{n.inventory_name}</b>
                          <p>{n.borrower_name} · {n.department_name}</p>
                          <span>{n.due_date ? `Jatuh tempo ${n.due_date}` : "Memerlukan tindakan penanggung jawab"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </section>

                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h2>Pengingat pengembalian</h2>
                      <p>Jatuh tempo dalam dua hari</p>
                    </div>
                    <Clock3 size={18} style={{ color: "var(--ink-muted)" }} />
                  </div>
                  {notifications.due_returns.length === 0 ? (
                    <div className="empty-state">
                      <div><Package size={22} /></div>
                      <span>Tidak ada barang yang mendekati jatuh tempo.</span>
                    </div>
                  ) : (
                    notifications.due_returns.map((n) => (
                      <div className="notice-row" key={n.id}>
                        <div className="notice-icon notice-warning"><Clock3 size={18} /></div>
                        <div>
                          <b>{n.inventory_name}</b>
                          <p>{n.borrower_name} · {n.department_name}</p>
                          <span>Jatuh tempo {n.due_date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </section>
              </div>
            </>
          )}

          {/* DEPARTMENTS PAGE */}
          {page === "Departemen" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="page-heading-action">
                    <button type="button" className="page-back-btn" onClick={() => setPage("Dashboard")} title="Kembali ke Dashboard">
                      <ArrowLeft size={15} /> Kembali ke Dashboard
                    </button>
                    <span className="eyebrow">STRUKTUR INVENTORI</span>
                  </div>
                  <h1>Departemen BEM IT Del</h1>
                  <p>Setiap barang dimiliki dan dikelola oleh departemen masing-masing.</p>
                </div>
              </div>

              <div className="dept-cards">
                {departments.map((d) => {
                  const DIcon = getDepartmentIcon(d.name);
                  const list = items.filter((i) => i.department_id === d.id);
                  const isMyDept = user?.role === "admin_departemen" && user.department_id === d.id;
                  return (
                    <div className="panel dept-card" key={d.id} style={isMyDept ? { border: "2px solid var(--olive)" } : {}}>
                      <div className={`dept-badge ${departmentColor[d.name] || "blue"}`} style={{ width: 46, height: 46 }}>
                        <DIcon size={22} />
                      </div>
                      <h2>
                        {d.name} {isMyDept && <span style={{ fontSize: 11, color: "var(--olive)", fontWeight: 800 }}> (Dikelola Anda)</span>}
                      </h2>
                      <p>{list.length} jenis barang · {list.reduce((n, i) => n + i.total_stock, 0)} unit total</p>
                      <div className="dept-sample">
                        {list.slice(0, 4).map((i) => (
                          <span key={i.id}>{i.name}</span>
                        ))}
                        {list.length > 4 && <span>+{list.length - 4} lainnya</span>}
                      </div>
                      <div className="contact-block">
                        <b>Penanggung jawab</b>
                        <span>{d.contact_name || "Belum diatur"}</span>
                        <span>{d.contact_email || "Email belum diatur"}</span>
                        {d.contact_phone && <span>{d.contact_phone}</span>}
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-full"
                        style={{ marginTop: 16 }}
                        onClick={() => {
                          setFilterDept(d.name);
                          setPage("Inventori");
                        }}
                      >
                        Lihat inventori <ArrowRight size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
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

      {/* MODALS */}
      {showLoanModal && selectedItemForLoan && (
        <LoanModal
          isOpen={showLoanModal}
          item={selectedItemForLoan}
          currentUser={user}
          onClose={() => {
            setShowLoanModal(false);
            setSelectedItemForLoan(null);
          }}
          onSubmit={handleLoanSubmit}
          onErrorToast={(msg) => showToast(msg)}
        />
      )}

      {showItemModal && user.role === "admin_departemen" && (
        <ItemModal
          isOpen={showItemModal}
          editingItem={editingItem}
          currentUser={user}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
          }}
          onSubmit={handleItemSubmit}
          onErrorToast={(msg) => showToast(msg)}
        />
      )}

      {returnLoanItem && (
        <ReturnModal
          loan={returnLoanItem}
          onClose={() => setReturnLoanItem(null)}
          onSubmit={handleReturnSubmit}
          onErrorToast={(msg) => showToast(msg)}
        />
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
          <button type="button" onClick={() => setToast("")} aria-label="Tutup notifikasi">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
