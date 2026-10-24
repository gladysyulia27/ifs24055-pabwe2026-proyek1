"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock3,
  Computer,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  Package,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShieldAlert,
  Users,
  X,
  Boxes,
  Mic,
  Music2,
  Volleyball,
  Flower2,
  Pencil,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  KeyRound,
  UserCheck,
  Sparkles,
  UploadCloud
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  identifier: string;
  role: "mahasiswa" | "admin_departemen";
  department_id: number | null;
  department_name: string | null;
  contact_phone: string;
};

type Department = { id: number; name: string; contact_name: string; contact_email: string; contact_phone: string; inventory_count: number };
type Item = { id: number; department_id: number; department_name: string; name: string; category: string; description: string; total_stock: number; available_stock: number; condition_status: string; image_url?: string };
type Loan = { id: number; inventory_id: number; inventory_name: string; department_name: string; borrower_name: string; borrower_id: string; borrower_contact: string; organization: string; purpose: string; quantity: number; start_date: string; due_date: string; status: string; return_proof_url: string; return_note?: string; approved_by?: string; created_at: string };
type Notice = { id: number; borrower_name: string; inventory_name: string; department_name: string; due_date?: string };

const departmentIcon: Record<string, typeof Camera> = {
  DEPKOMINFO: Camera,
  DIPTEK: Computer,
  DEPAGSOS: Flower2,
  DPDK: Users,
  DHPM: ClipboardList,
  DESARPRAS: Mic,
  DEPOL: Volleyball,
  DEPSENBUD: Music2,
  DEKEBDIS: ShieldAlert
};

const departmentColor: Record<string, string> = {
  DEPKOMINFO: "blue",
  DIPTEK: "violet",
  DEPAGSOS: "rose",
  DPDK: "amber",
  DHPM: "cyan",
  DESARPRAS: "orange",
  DEPOL: "green",
  DEPSENBUD: "pink",
  DEKEBDIS: "olive"
};

const statusClass = (s: string) =>
  s === "Disetujui" || s === "Dikembalikan"
    ? "status status-green"
    : s === "Ditolak"
    ? "status status-red"
    : s === "Menunggu Konfirmasi Pengembalian"
    ? "status status-blue"
    : "status status-amber";

const today = () => new Date().toISOString().slice(0, 10);

const itemImageMap: Record<string, string> = {
  "kamera": "/assets/kamera.png",
  "microphone rekam": "/assets/clip mic.png",
  "clip mic": "/assets/clip mic.png",
  "microphone": "/assets/microphone.png",
  "speaker": "/assets/speaker.png",
  "headphone": "/assets/headphone.png",
  "headset": "/assets/headphone.png",
  "bola basket": "/assets/bola basket.png",
  "bola futsal": "/assets/bola futsal.png",
  "raket": "/assets/raket.png",
  "raket badminton": "/assets/raket.png",
  "kok": "/assets/kok.png",
  "kok badminton": "/assets/kok.png",
  "shuttlecock": "/assets/kok.png",
  "gitar": "/assets/gitar.png",
  "bass": "/assets/bass.png",
  "alkitab": "/assets/alkitab.png",
  "vas": "/assets/vas.png",
  "vas bunga": "/assets/vas.png"
};

function getItemImage(itemOrName?: Item | string | null): string | null {
  if (!itemOrName) return null;
  if (typeof itemOrName === "object") {
    if (itemOrName.image_url) return itemOrName.image_url;
    return getItemImage(itemOrName.name);
  }
  const lower = itemOrName.toLowerCase().trim();
  if (itemImageMap[lower]) return itemImageMap[lower];
  for (const [key, path] of Object.entries(itemImageMap)) {
    if (lower.includes(key)) return path;
  }
  return null;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState("Dashboard");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [calendar, setCalendar] = useState<Loan[]>([]);
  const [notifications, setNotifications] = useState<{ due_returns: Notice[]; pending: Notice[] }>({ due_returns: [], pending: [] });
  const [demoAccounts, setDemoAccounts] = useState<User[]>([]);

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("Semua Departemen");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [authChecking, setAuthChecking] = useState(true);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username_or_email: "", password: "" });
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    identifier: "",
    contact_phone: ""
  });

  const [showLoan, setShowLoan] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [returnLoan, setReturnLoan] = useState<Loan | null>(null);

  const [form, setForm] = useState({
    borrower_name: "",
    borrower_id: "",
    borrower_contact: "",
    organization: "Mahasiswa",
    purpose: "",
    quantity: "1",
    start_date: today(),
    due_date: today()
  });

  const [itemForm, setItemForm] = useState({
    department_id: "",
    name: "",
    category: "Umum",
    description: "",
    total_stock: "1",
    condition_status: "Baik",
    image_url: ""
  });
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [proofUrl, setProofUrl] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [month, setMonth] = useState(new Date());
  const [mobileNav, setMobileNav] = useState(false);

  const showToast = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(""), 3500);
  };

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T> => {
      const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("bem_inventory_token") : null);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        ...((init?.headers as Record<string, string>) || {})
      };
      const res = await fetch(`${API}${path}`, { ...init, headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Permintaan gagal");
      return data as T;
    },
    [token]
  );

  // Initialize auth from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("bem_inventory_token");
    if (savedToken) {
      setToken(savedToken);
      fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem("bem_inventory_token");
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("bem_inventory_token");
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setAuthChecking(false);
        });
    } else {
      setAuthChecking(false);
    }

    // Load demo accounts for easy switching
    fetch(`${API}/auth/demo-accounts`)
      .then((res) => res.json())
      .then((accs) => {
        if (Array.isArray(accs)) setDemoAccounts(accs);
      })
      .catch(() => {});
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [d, i, l, c, n] = await Promise.all([
        request<Department[]>("/departments"),
        request<Item[]>("/inventory"),
        request<Loan[]>("/loans"),
        request<Loan[]>("/loans/calendar"),
        request<typeof notifications>("/notifications")
      ]);
      setDepartments(d);
      setItems(i);
      setLoans(l);
      setCalendar(c);
      setNotifications(n);
    } catch (e) {
      setError(e instanceof Error ? e.message : "API belum dapat dihubungi. Jalankan backend di port 4000.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void refresh();
  }, [refresh, user]);

  // Auth Handlers
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal masuk.");

      localStorage.setItem("bem_inventory_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setShowAuthModal(false);
      setLoginForm({ username_or_email: "", password: "" });
      showToast(`Selamat datang, ${data.user.full_name}!`);
      void refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const payload = {
        ...regForm,
        role: "mahasiswa",
        department_id: null
      };
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pendaftaran gagal.");

      localStorage.setItem("bem_inventory_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setShowAuthModal(false);
      showToast(`Akun berhasil dibuat. Selamat datang, ${data.user.full_name}!`);
      void refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Pendaftaran gagal.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {}
    localStorage.removeItem("bem_inventory_token");
    setToken(null);
    setUser(null);
    showToast("Anda telah keluar dari sistem.");
    void refresh();
  };

  const quickDemoLogin = async (username: string) => {
    setAuthLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username_or_email: username, password: "bemitdel123!" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal masuk.");

      localStorage.setItem("bem_inventory_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setShowAuthModal(false);
      showToast(`Masuk sebagai: ${data.user.full_name} (${data.user.role === "admin_departemen" ? "Admin " + data.user.department_name : "Mahasiswa"})`);
      void refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Inventory Management (Department Admin only)
  const resetItemForm = (item?: Item) => {
    if (!user || user.role !== "admin_departemen") {
      showToast("Hanya Admin Departemen yang dapat mengelola inventori.");
      return;
    }
    setEditingItem(item || null);
    setItemForm(
      item
        ? {
            department_id: String(item.department_id),
            name: item.name,
            category: item.category,
            description: item.description,
            total_stock: String(item.total_stock),
            condition_status: item.condition_status,
            image_url: item.image_url || getItemImage(item.name) || ""
          }
        : {
            department_id: String(user.department_id || departments[0]?.id || ""),
            name: "",
            category: "Umum",
            description: "",
            total_stock: "1",
            condition_status: "Baik",
            image_url: ""
          }
    );
    setShowUrlInput(false);
    setShowItem(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("File yang dipilih harus berupa file gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran foto maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL("image/webp", 0.86);
          setItemForm((prev) => ({ ...prev, image_url: compressed }));
        } else {
          setItemForm((prev) => ({ ...prev, image_url: src }));
        }
        showToast("Foto berhasil dimuat");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const submitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...itemForm,
        department_id: Number(itemForm.department_id),
        total_stock: Number(itemForm.total_stock)
      };
      if (editingItem) await request(`/inventory/${editingItem.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      else await request("/inventory", { method: "POST", body: JSON.stringify(payload) });
      setShowItem(false);
      await refresh();
      showToast(editingItem ? "Inventori berhasil diperbarui" : "Inventori berhasil ditambahkan");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan inventori");
    }
  };

  const deleteItem = async (item: Item) => {
    if (!window.confirm(`Hapus barang: "${item.name}" dari inventori?`)) return;
    try {
      await request(`/inventory/${item.id}`, { method: "DELETE" });
      await refresh();
      showToast("Barang berhasil dihapus");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal menghapus barang");
    }
  };

  // Loans (Mahasiswa applies, Department Admin approves/rejects)
  const openLoanModal = (item: Item) => {
    if (!user) {
      showToast("Silakan login terlebih dahulu untuk mengajukan peminjaman.");
      setShowAuthModal(true);
      return;
    }
    if (user.role === "admin_departemen") {
      showToast("Akun Admin Departemen tidak dapat meminjam inventori. Gunakan akun Mahasiswa.");
      return;
    }
    setSelectedItem(item);
    setForm({
      borrower_name: user.full_name,
      borrower_id: user.identifier,
      borrower_contact: user.contact_phone || "",
      organization: "Mahasiswa",
      purpose: "",
      quantity: "1",
      start_date: today(),
      due_date: today()
    });
    setShowLoan(true);
  };

  const submitLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await request("/loans", {
        method: "POST",
        body: JSON.stringify({ ...form, inventory_id: selectedItem.id, quantity: Number(form.quantity) })
      });
      setShowLoan(false);
      setSelectedItem(null);
      await refresh();
      showToast("Pengajuan peminjaman berhasil dikirim ke penanggung jawab departemen");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal mengajukan peminjaman");
    }
  };

  const loanAction = async (loan: Loan, action: "approve" | "reject" | "confirm-return") => {
    try {
      await request(`/loans/${loan.id}/${action}`, {
        method: "PATCH",
        body: JSON.stringify({ approved_by: user ? `${user.full_name} (${user.department_name})` : "Penanggung Jawab" })
      });
      await refresh();
      showToast(
        action === "approve"
          ? "Peminjaman berhasil disetujui"
          : action === "reject"
          ? "Pengajuan peminjaman ditolak"
          : "Pengembalian barang telah dikonfirmasi"
      );
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Aksi gagal");
    }
  };

  const submitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnLoan) return;
    try {
      await request(`/loans/${returnLoan.id}/return`, {
        method: "PATCH",
        body: JSON.stringify({ return_proof_url: proofUrl, return_note: returnNote })
      });
      setReturnLoan(null);
      setProofUrl("");
      setReturnNote("");
      await refresh();
      showToast("Bukti pengembalian terkirim. Menunggu konfirmasi pengelola departemen.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal mengirim bukti");
    }
  };

  const changePage = (p: string) => {
    setPage(p);
    setMobileNav(false);
  };

  // Nav Items customized by role
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Inventori", icon: Package },
    { name: user?.role === "admin_departemen" ? "Persetujuan Peminjaman" : "Peminjaman Saya", icon: ClipboardList, pageKey: "Peminjaman" },
    { name: "Kalender", icon: CalendarDays },
    { name: "Departemen", icon: Boxes }
  ];

  const visibleItems = useMemo(
    () =>
      items.filter(
        (i) =>
          (filterDept === "Semua Departemen" || i.department_name === filterDept) &&
          `${i.name} ${i.category} ${i.department_name}`.toLowerCase().includes(search.toLowerCase())
      ),
    [items, filterDept, search]
  );

  const pendingLoans = loans.filter((l) => l.status === "Menunggu Approval");
  const activeLoans = loans.filter((l) => l.status === "Disetujui");
  const returnPending = loans.filter((l) => l.status === "Menunggu Konfirmasi Pengembalian");
  const totalStock = items.reduce((n, i) => n + i.total_stock, 0);
  const availableStock = items.reduce((n, i) => n + i.available_stock, 0);

  const calendarDays = () => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({length: count}, (_, i) => i + 1)];
  };

  const monthName = month.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const nav = (
    <>
      <div className="brand">
        <div className="brand-mark-box">
          <img src="/logo-bem-del.png" alt="BEM IT Del" className="brand-logo-img" />
        </div>
        <div className="brand-titles">
          <strong>BEM IT Del</strong>
          <span>INVENTORI & PEMINJAMAN</span>
        </div>
      </div>

      <div className="nav-label">MENU UTAMA</div>
      {navItems.map((n) => {
        const targetPage = n.pageKey || n.name;
        const isActive = page === targetPage;
        return (
          <button key={n.name} onClick={() => changePage(targetPage)} className={`nav-link ${isActive ? "active" : ""}`}>
            <n.icon size={18} />
            <span>{n.name}</span>
            {targetPage === "Notifikasi" && notifications.pending.length > 0 && (
              <b className="nav-count">{notifications.pending.length}</b>
            )}
            {targetPage === "Peminjaman" && user?.role === "admin_departemen" && pendingLoans.length > 0 && (
              <b className="nav-count">{pendingLoans.length}</b>
            )}
          </button>
        );
      })}

      <div className="sidebar-bottom">
        {user && (
          <div className="help-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
            <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 13, flexShrink: 0 }}>
              {user.role === "admin_departemen" ? "PJ" : "M"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <b style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", display: "block" }}>{user.full_name}</b>
              <span style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user.role === "admin_departemen" ? `Admin ${user.department_name}` : `NIM: ${user.identifier}`}
              </span>
            </div>
            <button
              type="button"
              className="logout-icon-btn"
              onClick={handleLogout}
              title="Keluar"
              aria-label="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );

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

  // 2. Auth Gate View (Mahasiswa & Admin Must Login)
  if (!user) {
    return (
      <div className="auth-gate-page">
        <header className="auth-gate-header">
          <div className="auth-gate-brand">
            <img src="/logo-bem-del.png?v=2" alt="Logo BEM IT Del" />
            <div className="auth-gate-brand-copy">
              <h1>BEM Institut Teknologi Del</h1>
              <span>Sistem Manajemen & Peminjaman Inventori Organisasi</span>
            </div>
          </div>
          <div className="auth-gate-badge">
            <i /> Portal Akses Resmi Mahasiswa & Pengurus
          </div>
        </header>

        <div className="auth-gate-body">
          <div className="auth-gate-container">
            {/* Left Hero Column */}
            <div className="auth-hero-section">
              <div className="auth-hero-pill">
                <Sparkles size={14} style={{ color: "var(--pink-ink)" }} />
                <span>GERBANG AUTORISASI RESMI</span>
              </div>

              <h2 className="auth-hero-title">
                Satu Pintu Akses <span>Inventori Terpadu</span> BEM IT Del
              </h2>

              <p className="auth-hero-subtitle">
                Mahasiswa dan Pengelola Departemen BEM wajib masuk terlebih dahulu untuk mengakses katalog logistik, mengajukan permohonan peminjaman, serta mengawasi ketersediaan barang.
              </p>

              <div className="auth-sway-showcase">
                <div className="auth-sway-glow" />
                <div className="auth-sway-logo-wrap">
                  <img src="/logo-bem-del.png?v=2" alt="Logo Resmi BEM Institut Teknologi Del" />
                  <div className="auth-sway-shadow" />
                </div>
              </div>
            </div>

            {/* Right Auth Card Panel */}
            <div className="auth-card-panel">
              <div className="auth-card-head">
                <h2>{authTab === "login" ? "Masuk ke Sistem" : "Pendaftaran Akun Baru"}</h2>
                <p>
                  {authTab === "login"
                    ? "Masukkan email atau username dan password Anda. Sistem otomatis mendeteksi peran Anda."
                    : "Lengkapi data diri Anda untuk membuat akun Mahasiswa BEM IT Del."}
                </p>
              </div>

              <div className="auth-tabs" style={{ marginBottom: 18 }}>
                <button
                  type="button"
                  id="tab-login"
                  className={`auth-tab-btn ${authTab === "login" ? "active" : ""}`}
                  onClick={() => setAuthTab("login")}
                >
                  <LogIn size={15} /> Masuk (Login)
                </button>
                <button
                  type="button"
                  id="tab-register"
                  className={`auth-tab-btn ${authTab === "register" ? "active" : ""}`}
                  onClick={() => setAuthTab("register")}
                >
                  <UserPlus size={15} /> Daftar Akun (Register)
                </button>
              </div>

              {authTab === "login" ? (
                <form className="form-stack" onSubmit={handleLogin}>
                  <Field label="Username atau Email *">
                    <input
                      id="input-login-username"
                      required
                      autoFocus
                      value={loginForm.username_or_email}
                      onChange={(e) => setLoginForm({ ...loginForm, username_or_email: e.target.value })}
                      placeholder="Contoh: mahasiswa atau user@del.ac.id"
                    />
                  </Field>
                  <Field label="Password *">
                    <input
                      id="input-login-password"
                      required
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Masukkan password Anda"
                    />
                  </Field>

                  <button id="btn-login-submit" className="btn btn-accent btn-full" type="submit" disabled={authLoading} style={{ marginTop: 4 }}>
                    {authLoading ? "Memverifikasi..." : "Masuk ke Dashboard"} <ArrowRight size={16} />
                  </button>

                  <div className="demo-box" style={{ marginTop: 16 }}>
                    <div className="demo-box-head">
                      <b>⚡ Akun Demo Pengujian Cepat</b>
                      <span style={{ fontSize: 10, color: "var(--ink-secondary)" }}>1-Klik langsung masuk</span>
                    </div>
                    <div className="demo-chips-grid">
                      <button id="demo-btn-mahasiswa" type="button" className="demo-chip" onClick={() => quickDemoLogin("mahasiswa")}>
                        🎓 Mahasiswa (Andi)
                      </button>
                      <button id="demo-btn-depkominfo" type="button" className="demo-chip" onClick={() => quickDemoLogin("depkomitdel@gmail.com")}>
                        📸 DEPKOMINFO
                      </button>
                      <button id="demo-btn-desarpras" type="button" className="demo-chip" onClick={() => quickDemoLogin("desarprasitdel@gmail.com")}>
                        🔊 DESARPRAS
                      </button>
                      <button id="demo-btn-dekebdis" type="button" className="demo-chip" onClick={() => quickDemoLogin("dekebdisitdel@gmail.com")}>
                        🛡️ DEKEBDIS
                      </button>
                      <button id="demo-btn-diptek" type="button" className="demo-chip" onClick={() => quickDemoLogin("diptekitdel@gmail.com")}>
                        💻 DIPTEK
                      </button>
                      <button id="demo-btn-depol" type="button" className="demo-chip" onClick={() => quickDemoLogin("depolitdel@gmail.com")}>
                        ⚽ DEPOL
                      </button>
                      <button id="demo-btn-depagsos" type="button" className="demo-chip" onClick={() => quickDemoLogin("depagsositdel@gmail.com")}>
                        🌸 DEPAGSOS
                      </button>
                      <button id="demo-btn-dpdk" type="button" className="demo-chip" onClick={() => quickDemoLogin("dpdkitdel@gmail.com")}>
                        👥 DPDK
                      </button>
                      <button id="demo-btn-dhpm" type="button" className="demo-chip" onClick={() => quickDemoLogin("dhpmitdel@gmail.com")}>
                        📋 DHPM
                      </button>
                      <button id="demo-btn-depsenbud" type="button" className="demo-chip" onClick={() => quickDemoLogin("depsenbuditdel@gmail.com")}>
                        🎵 DEPSENBUD
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <form className="form-stack" onSubmit={handleRegister}>
                  <div className="form-grid">
                    <Field label="Nama Lengkap *">
                      <input
                        required
                        value={regForm.full_name}
                        onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
                        placeholder="Nama lengkap"
                      />
                    </Field>
                    <Field label="NIM Mahasiswa *">
                      <input
                        required
                        value={regForm.identifier}
                        onChange={(e) => setRegForm({ ...regForm, identifier: e.target.value })}
                        placeholder="Contoh: 11S24001"
                      />
                    </Field>
                    <Field label="Username *">
                      <input
                        required
                        value={regForm.username}
                        onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                        placeholder="Username unik"
                      />
                    </Field>
                    <Field label="Alamat Email *">
                      <input
                        required
                        type="email"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="nama@del.ac.id"
                      />
                    </Field>
                    <Field label="Nomor Kontak (WhatsApp)">
                      <input
                        value={regForm.contact_phone}
                        onChange={(e) => setRegForm({ ...regForm, contact_phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                      />
                    </Field>
                    <Field label="Password *">
                      <input
                        required
                        type="password"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Minimal 6 karakter"
                      />
                    </Field>
                  </div>

                  <button className="btn btn-accent btn-full" type="submit" disabled={authLoading}>
                    {authLoading ? "Mendaftarkan..." : "Daftar Akun Mahasiswa & Masuk"} <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <footer className="auth-footer">
          BEM Institut Teknologi Del · &ldquo;Satu Sistem, Semua Inventori, Kegiatan Lebih Baik.&rdquo; · Sistem Inventori Kampus 2026
        </footer>

        {toast && (
          <div className="toast">
            <CheckCircle2 size={18} />
            {toast}
            <button onClick={() => setToast("")}>
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. Authenticated Dashboard View
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>{nav}</aside>
      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Tutup menu" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu" onClick={() => setMobileNav(!mobileNav)}>
              <Menu size={20} />
            </button>
            <div className="crumb">
              BEM IT Del <span>/</span> <b>{page}</b>
            </div>
          </div>

          <div className="top-actions">
            <button className="icon-btn notification-btn" onClick={() => changePage("Notifikasi")} title="Notifikasi">
              <Bell size={18} />
              {notifications.pending.length > 0 && <i />}
            </button>
            <div className="user-avatar">{user.role === "admin_departemen" ? "PJ" : "M"}</div>
            <div className="user-info">
              <b>{user.full_name}</b>
              <span>{user.role === "admin_departemen" ? `Pengelola ${user.department_name}` : "Peminjam Mahasiswa"}</span>
            </div>
          </div>
        </header>

        <div className="content">
          {error && (
            <div className="error-banner">
              <Activity size={18} />
              <div>
                <b>API belum tersambung</b>
                <span>{error}. Pastikan backend Express aktif di <code>localhost:4000</code>.</span>
              </div>
              <button onClick={() => void refresh()} className="btn btn-small">Coba lagi</button>
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
              <button className="btn btn-accent btn-small" onClick={() => resetItemForm()}>
                <Plus size={15} /> Tambah Inventori {user.department_name}
              </button>
            </div>
          )}

          {/* DASHBOARD */}
          {page === "Dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">OVERVIEW ORGANISASI</div>
                  <h1>Dashboard Inventori</h1>
                  <p>Pantau ketersediaan barang dan aktivitas peminjaman BEM IT Del.</p>
                </div>
                <button className="btn btn-accent" onClick={() => changePage("Inventori")}>
                  <Package size={17} /> Jelajahi inventori <ArrowRight size={16} />
                </button>
              </div>

              <div className="stats-grid">
                <Stat icon={<Package size={20} />} label="Total Inventori" value={totalStock} sub={`${items.length} jenis barang`} color="blue" />
                <Stat icon={<ArrowDownToLine size={20} />} label="Sedang Dipinjam" value={activeLoans.reduce((n, l) => n + l.quantity, 0)} sub={`${activeLoans.length} transaksi aktif`} color="pink" />
                <Stat icon={<CheckCircle2 size={20} />} label="Barang Tersedia" value={availableStock} sub="Siap dipinjam" color="green" />
                <Stat icon={<Clock3 size={20} />} label="Menunggu Approval" value={pendingLoans.length} sub="Perlu ditinjau" color="yellow" />
              </div>

              <div className="dashboard-grid">
                <section className="panel department-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Inventori per Departemen</h2>
                      <p>Ringkasan kepemilikan barang</p>
                    </div>
                    <button className="text-btn" onClick={() => changePage("Departemen")}>
                      Lihat semua <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="department-list">
                    {departments.map((d) => {
                      const DIcon = departmentIcon[d.name] || Package;
                      const count = items.filter((i) => i.department_id === d.id).reduce((n, i) => n + i.total_stock, 0);
                      const isMyDept = user?.role === "admin_departemen" && user.department_id === d.id;
                      return (
                        <button
                          className="department-row"
                          key={d.id}
                          onClick={() => {
                            setFilterDept(d.name);
                            changePage("Inventori");
                          }}
                          style={isMyDept ? { border: "1.5px solid var(--olive)" } : {}}
                        >
                          <div className={`dept-badge ${departmentColor[d.name] || "blue"}`}>
                            <DIcon size={18} />
                          </div>
                          <div className="dept-name">
                            <b>
                              {d.name} {isMyDept && <span style={{ color: "var(--olive)", fontWeight: 800 }}>★ Dikelola Anda</span>}
                            </b>
                            <span>{items.filter((i) => i.department_id === d.id).length} jenis barang</span>
                          </div>
                          <div className="dept-bar">
                            <div style={{ width: `${Math.min(100, totalStock ? (count / totalStock) * 100 : 0)}%` }} />
                          </div>
                          <b className="dept-total">{count}</b>
                          <ArrowRight size={15} style={{ color: "var(--ink-muted)" }} />
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="panel activity-panel">
                  <div className="panel-head">
                    <div>
                      <h2>{user?.role === "admin_departemen" ? `Peminjaman Departemen ${user.department_name}` : "Aktivitas Peminjaman"}</h2>
                      <p>Transaksi terbaru</p>
                    </div>
                    <button className="text-btn" onClick={() => changePage("Peminjaman")}>
                      Lihat semua <ArrowRight size={14} />
                    </button>
                  </div>
                  {loans.slice(0, 5).length === 0 ? (
                    <Empty text="Belum ada aktivitas peminjaman." />
                  ) : (
                    <div className="activity-list">
                      {loans.slice(0, 5).map((l) => (
                        <div className="activity-row" key={l.id}>
                          {getItemImage(l.inventory_name) ? (
                            <img src={getItemImage(l.inventory_name)!} alt={l.inventory_name} className="item-thumb-img" />
                          ) : (
                            <div className="activity-icon">
                              <Package size={17} />
                            </div>
                          )}
                          <div className="activity-copy">
                            <b>{l.inventory_name}</b>
                            <span>{l.borrower_name} · {l.department_name}</span>
                          </div>
                          <span className={statusClass(l.status)}>{l.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <section className="panel quick-panel">
                <div className="panel-head">
                  <div>
                    <h2>Inventori yang tersedia</h2>
                    <p>Barang yang siap diajukan untuk kegiatan kampus</p>
                  </div>
                  <button className="text-btn" onClick={() => changePage("Inventori")}>
                    Buka katalog <ArrowRight size={14} />
                  </button>
                </div>
                <div className="quick-items">
                  {items
                    .filter((i) => i.available_stock > 0)
                    .slice(0, 4)
                    .map((i) => (
                      <ItemCard
                        key={i.id}
                        item={i}
                        currentUser={user}
                        onBorrow={openLoanModal}
                        onEdit={resetItemForm}
                        onDelete={deleteItem}
                      />
                    ))}
                </div>
              </section>
            </>
          )}

          {/* INVENTORY CATALOG */}
          {page === "Inventori" && (
            <>
              <div className="page-heading">
                <div>
                  <button type="button" className="page-back-btn" onClick={() => changePage("Dashboard")} title="Kembali ke Dashboard">
                    <ArrowLeft size={15} /> Kembali ke Dashboard
                  </button>
                  <div className="eyebrow">KATALOG BARANG</div>
                  <h1>Inventori Departemen</h1>
                  <p>
                    {user?.role === "admin_departemen"
                      ? `Kelola stok barang departemen ${user.department_name}, atau pantau inventori departemen lainnya.`
                      : "Temukan barang inventori dan ajukan peminjaman sesuai kebutuhan kegiatan."}
                  </p>
                </div>
                {user?.role === "admin_departemen" && (
                  <button className="btn btn-accent" onClick={() => resetItemForm()}>
                    <Plus size={17} /> Tambah inventori {user.department_name}
                  </button>
                )}
              </div>

              <div className="panel">
                <div className="filters">
                  <div className="search-box">
                    <Search size={17} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama barang, kategori..." />
                  </div>
                  <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                    <option>Semua Departemen</option>
                    {departments.map((d) => (
                      <option key={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <span className="result-count">{visibleItems.length} barang</span>
                </div>

                {loading ? (
                  <Empty text="Memuat inventori..." />
                ) : visibleItems.length === 0 ? (
                  <Empty text="Tidak ada barang yang cocok." />
                ) : (
                  <div className="inventory-grid">
                    {visibleItems.map((i) => (
                      <ItemCard
                        key={i.id}
                        item={i}
                        currentUser={user}
                        onBorrow={openLoanModal}
                        onEdit={resetItemForm}
                        onDelete={deleteItem}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* LOANS / TRANSACTIONS */}
          {page === "Peminjaman" && (
            <>
              <div className="page-heading">
                <div>
                  <button type="button" className="page-back-btn" onClick={() => changePage("Dashboard")} title="Kembali ke Dashboard">
                    <ArrowLeft size={15} /> Kembali ke Dashboard
                  </button>
                  <div className="eyebrow">TRANSAKSI INVENTORI</div>
                  <h1>
                    {user?.role === "admin_departemen"
                      ? `Persetujuan Peminjaman — ${user.department_name}`
                      : user
                      ? "Peminjaman Saya"
                      : "Daftar Peminjaman"}
                  </h1>
                  <p>
                    {user?.role === "admin_departemen"
                      ? `Tinjau permohonan peminjaman dan konfirmasi pengembalian barang milik departemen ${user.department_name}.`
                      : user
                      ? "Pantau status pengajuan peminjaman dan kirim bukti foto pengembalian barang."
                      : "Silakan login untuk memantau peminjaman Anda."}
                  </p>
                </div>
                {user?.role === "mahasiswa" && (
                  <button className="btn btn-accent" onClick={() => changePage("Inventori")}>
                    <Plus size={17} /> Ajukan pinjaman baru
                  </button>
                )}
              </div>

              <div className="panel">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>BARANG</th>
                        <th>PEMINJAM</th>
                        <th>PERIODE</th>
                        <th>JUMLAH</th>
                        <th>STATUS</th>
                        <th>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((l) => (
                        <tr key={l.id}>
                          <td>
                            <div className="table-item">
                              {getItemImage(l.inventory_name) ? (
                                <img src={getItemImage(l.inventory_name)!} alt={l.inventory_name} className="item-thumb-img" />
                              ) : (
                                <div className="mini-item">
                                  <Package size={17} />
                                </div>
                              )}
                              <div>
                                <b>{l.inventory_name}</b>
                                <span>{l.department_name}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <b>{l.borrower_name}</b>
                            <span className="table-sub">{l.organization} · {l.borrower_id}</span>
                          </td>
                          <td>
                            <b>{l.start_date}</b>
                            <span className="table-sub">s.d. {l.due_date}</span>
                          </td>
                          <td>{l.quantity} unit</td>
                          <td>
                            <span className={statusClass(l.status)}>{l.status}</span>
                          </td>
                          <td>
                            <div className="table-actions">
                              {/* Admin Departemen: Approve / Reject for items in their department */}
                              {user?.role === "admin_departemen" && l.status === "Menunggu Approval" && (
                                <>
                                  <button className="icon-btn action-green" title="Setujui Peminjaman" onClick={() => void loanAction(l, "approve")}>
                                    <Check size={16} />
                                  </button>
                                  <button className="icon-btn action-red" title="Tolak Pengajuan" onClick={() => void loanAction(l, "reject")}>
                                    <X size={16} />
                                  </button>
                                </>
                              )}

                              {/* Mahasiswa: Submit return proof for approved loans */}
                              {user?.role === "mahasiswa" && l.status === "Disetujui" && (
                                <button className="btn btn-small btn-secondary" onClick={() => setReturnLoan(l)}>
                                  Kirim bukti pengembalian
                                </button>
                              )}

                              {/* Admin Departemen: Confirm return after reviewing proof */}
                              {user?.role === "admin_departemen" && l.status === "Menunggu Konfirmasi Pengembalian" && (
                                <>
                                  <a className="proof-link" href={l.return_proof_url} target="_blank" rel="noreferrer">
                                    Lihat bukti
                                  </a>
                                  <button className="btn btn-small btn-accent" onClick={() => void loanAction(l, "confirm-return")}>
                                    Konfirmasi Kembali
                                  </button>
                                </>
                              )}

                              {!["Menunggu Approval", "Disetujui", "Menunggu Konfirmasi Pengembalian"].includes(l.status) && (
                                <span style={{ color: "var(--ink-muted)" }}>—</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loans.length === 0 && <Empty text={user ? "Belum ada transaksi peminjaman untuk akun Anda." : "Belum ada transaksi peminjaman."} />}
                </div>
              </div>
            </>
          )}

          {/* CALENDAR */}
          {page === "Kalender" && (
            <>
              <div className="page-heading">
                <div>
                  <button type="button" className="page-back-btn" onClick={() => changePage("Dashboard")} title="Kembali ke Dashboard">
                    <ArrowLeft size={15} /> Kembali ke Dashboard
                  </button>
                  <div className="eyebrow">JADWAL BARANG</div>
                  <h1>Kalender Peminjaman</h1>
                  <p>Lihat jadwal peminjaman yang telah disetujui untuk setiap barang.</p>
                </div>
                <div className="calendar-legend">
                  <span><i className="legend-blue" /> Mulai pinjam</span>
                  <span><i className="legend-green" /> Pengembalian</span>
                </div>
              </div>

              <div className="calendar-layout panel">
                <div className="calendar-main">
                  <div className="calendar-toolbar">
                    <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
                    <h2>{monthName}</h2>
                    <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
                    <button className="btn btn-small btn-secondary" onClick={() => setMonth(new Date())}>Hari ini</button>
                  </div>
                  <div className="calendar-grid">
                    {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
                      <div className="calendar-weekday" key={d}>{d}</div>
                    ))}
                    {calendarDays().map((day, index) => (
                      <div className={`calendar-cell ${day === Number(today().slice(8)) && month.getMonth() === new Date().getMonth() ? "today" : ""}`} key={index}>
                        {day && (
                          <>
                            <span className="day-number">{day}</span>
                            {calendar
                              .filter((l) => l.start_date === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
                              .map((l) => (
                                <div key={l.id} className="calendar-event" title={`${l.inventory_name} — ${l.borrower_name}`}>
                                  {l.inventory_name}
                                </div>
                              ))}
                            {calendar
                              .filter((l) => l.due_date === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
                              .map((l) => (
                                <div key={`due${l.id}`} className="calendar-event event-green" title={`Pengembalian ${l.inventory_name}`}>
                                  Kembali: {l.inventory_name}
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="calendar-side">
                  <h3>Jadwal aktif</h3>
                  <p>{calendar.length} transaksi terjadwal</p>
                  {calendar.length === 0 ? (
                    <Empty text="Belum ada jadwal." />
                  ) : (
                    calendar.map((l) => (
                      <div className="schedule-card" key={l.id}>
                        <span className="schedule-date">{l.start_date}</span>
                        <b>{l.inventory_name}</b>
                        <span>{l.borrower_name}</span>
                        <small>{l.department_name} · kembali {l.due_date}</small>
                      </div>
                    ))
                  )}
                </aside>
              </div>
            </>
          )}

          {/* NOTIFICATIONS */}
          {page === "Notifikasi" && (
            <>
              <div className="page-heading">
                <div>
                  <button type="button" className="page-back-btn" onClick={() => changePage("Dashboard")} title="Kembali ke Dashboard">
                    <ArrowLeft size={15} /> Kembali ke Dashboard
                  </button>
                  <div className="eyebrow">PEMBERITAHUAN</div>
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
                    <Empty text="Tidak ada pemberitahuan baru." />
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
                    <Empty text="Tidak ada barang yang mendekati jatuh tempo." />
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

          {/* DEPARTMENTS */}
          {page === "Departemen" && (
            <>
              <div className="page-heading">
                <div>
                  <button type="button" className="page-back-btn" onClick={() => changePage("Dashboard")} title="Kembali ke Dashboard">
                    <ArrowLeft size={15} /> Kembali ke Dashboard
                  </button>
                  <div className="eyebrow">STRUKTUR INVENTORI</div>
                  <h1>Departemen BEM IT Del</h1>
                  <p>Setiap barang dimiliki dan dikelola oleh departemen masing-masing.</p>
                </div>
              </div>

              <div className="dept-cards">
                {departments.map((d) => {
                  const DIcon = departmentIcon[d.name] || Package;
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
                        className="btn btn-secondary btn-full"
                        style={{ marginTop: 16 }}
                        onClick={() => {
                          setFilterDept(d.name);
                          changePage("Inventori");
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

      {/* ==========================================
          MODALS
         ========================================== */}



      {/* LOAN REQUEST MODAL */}
      {showLoan && selectedItem && (
        <Modal title="Form Peminjaman Inventori" onClose={() => setShowLoan(false)}>
          <div className="selected-item">
            {getItemImage(selectedItem.name) ? (
              <img src={getItemImage(selectedItem.name)!} alt={selectedItem.name} className="item-thumb-img" style={{ width: 48, height: 48 }} />
            ) : (
              <div className="mini-item">
                <Package size={20} />
              </div>
            )}
            <div>
              <b>{selectedItem.name}</b>
              <span>{selectedItem.department_name} · tersedia {selectedItem.available_stock} unit</span>
            </div>
          </div>
          <form className="form-stack" onSubmit={submitLoan}>
            <div className="form-grid">
              <Field label="Nama Peminjam *">
                <input required value={form.borrower_name} onChange={(e) => setForm({ ...form, borrower_name: e.target.value })} />
              </Field>
              <Field label="NIM / ID *">
                <input required value={form.borrower_id} onChange={(e) => setForm({ ...form, borrower_id: e.target.value })} />
              </Field>
              <Field label="Nomor Kontak (WhatsApp)">
                <input value={form.borrower_contact} onChange={(e) => setForm({ ...form, borrower_contact: e.target.value })} />
              </Field>
              <Field label="Peminjam Sebagai">
                <select value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}>
                  <option>Mahasiswa</option>
                  <option>Kepanitiaan</option>
                  <option>Organisasi Mahasiswa</option>
                  <option>Unit Kegiatan Mahasiswa (UKM)</option>
                </select>
              </Field>
              <Field label="Tanggal Pinjam *">
                <input
                  type="date"
                  required
                  min={today()}
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      start_date: e.target.value,
                      due_date: form.due_date < e.target.value ? e.target.value : form.due_date
                    })
                  }
                />
              </Field>
              <Field label="Tanggal Pengembalian *">
                <input
                  type="date"
                  required
                  min={form.start_date}
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </Field>
              <Field label="Jumlah Barang *">
                <input
                  type="number"
                  min="1"
                  max={selectedItem.available_stock}
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Tujuan & Alasan Peminjaman *">
              <textarea
                required
                rows={3}
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="Jelaskan kebutuhan kegiatan peminjaman barang ini..."
              />
            </Field>
            <div className="form-note">
              <ShieldCheck size={17} />
              Pengajuan akan langsung masuk ke panel persetujuan pengelola {selectedItem.department_name}.
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowLoan(false)}>
                Kembali
              </button>
              <button className="btn btn-accent" type="submit">
                Kirim Pengajuan <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ADD / EDIT ITEM MODAL (ADMIN DEPARTEMEN) */}
      {showItem && user && user.role === "admin_departemen" && (
        <Modal title={editingItem ? "Edit Inventori" : `Tambah Inventori ${user.department_name}`} onClose={() => setShowItem(false)}>
          <form className="form-stack" onSubmit={submitItem}>
            {/* Foto Barang Upload Area */}
            <div className="photo-upload-section">
              <label className="field-label">Foto Barang</label>
              {itemForm.image_url ? (
                <div className="photo-preview-box">
                  <img src={itemForm.image_url} alt="Preview Foto Barang" className="photo-preview-img" />
                  <div className="photo-preview-overlay">
                    <label className="btn btn-secondary btn-small photo-upload-btn" title="Ganti Foto">
                      <Camera size={14} /> Ganti Foto
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-small photo-remove-btn"
                      onClick={() => setItemForm({ ...itemForm, image_url: "" })}
                      title="Hapus Foto"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <label className="photo-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <div className="photo-dropzone-icon">
                    <UploadCloud size={24} />
                  </div>
                  <div className="photo-dropzone-text">
                    <b>Unggah Foto Barang</b>
                    <span>Klik atau seret file foto ke sini (PNG, JPG, WebP)</span>
                  </div>
                </label>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <button
                  type="button"
                  className="text-btn"
                  style={{ fontSize: 11.5 }}
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  {showUrlInput ? "Sembunyikan input URL" : "Atau gunakan tautan / URL foto"}
                </button>
              </div>

              {showUrlInput && (
                <Field label="URL / Tautan Foto">
                  <input
                    type="url"
                    value={itemForm.image_url}
                    onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                    placeholder="Contoh: https://images.unsplash.com/... atau /assets/kamera.png"
                  />
                </Field>
              )}
            </div>

            <div className="form-grid">
              <Field label="Departemen Pemilik">
                <input
                  disabled
                  value={user.department_name || ""}
                  style={{ background: "var(--surface)", fontWeight: 700 }}
                />
              </Field>
              <Field label="Nama Barang *">
                <input
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="Contoh: Kamera DSLR Canon"
                />
              </Field>
              <Field label="Kategori">
                <input
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                  placeholder="Contoh: Dokumentasi, Audio, Olahraga"
                />
              </Field>
              <Field label="Stok Total *">
                <input
                  type="number"
                  min="0"
                  required
                  value={itemForm.total_stock}
                  onChange={(e) => setItemForm({ ...itemForm, total_stock: e.target.value })}
                />
              </Field>
              <Field label="Kondisi Barang">
                <select
                  value={itemForm.condition_status}
                  onChange={(e) => setItemForm({ ...itemForm, condition_status: e.target.value })}
                >
                  <option>Baik</option>
                  <option>Perlu Perbaikan</option>
                  <option>Rusak</option>
                </select>
              </Field>
            </div>
            <Field label="Deskripsi Barang">
              <textarea
                rows={3}
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Keterangan kelengkapan, nomor seri, atau kondisi barang..."
              />
            </Field>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowItem(false)}>
                Kembali
              </button>
              <button className="btn btn-primary" type="submit">
                Simpan Inventori
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* RETURN PROOF MODAL */}
      {returnLoan && (
        <Modal title="Kirim Bukti Pengembalian Barang" onClose={() => setReturnLoan(null)}>
          <div className="selected-item">
            {getItemImage(returnLoan.inventory_name) ? (
              <img src={getItemImage(returnLoan.inventory_name)!} alt={returnLoan.inventory_name} className="item-thumb-img" style={{ width: 48, height: 48 }} />
            ) : (
              <div className="mini-item">
                <ImageIcon size={20} />
              </div>
            )}
            <div>
              <b>{returnLoan.inventory_name}</b>
              <span>{returnLoan.department_name} · {returnLoan.quantity} unit</span>
            </div>
          </div>
          <form className="form-stack" onSubmit={submitReturn}>
            <Field label="URL Bukti Foto Pengembalian *">
              <input
                required
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... atau link foto Google Drive"
              />
            </Field>
            <p className="field-help">Sertakan URL foto barang yang telah dikembalikan kepada pengelola departemen.</p>
            <Field label="Catatan Kondisi Barang Saat Pengembalian">
              <textarea
                rows={3}
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="Contoh: Barang dalam kondisi lengkap dan bersih tanpa kerusakan."
              />
            </Field>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setReturnLoan(null)}>
                Kembali
              </button>
              <button className="btn btn-accent" type="submit">
                Kirim Bukti
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
          <button onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// Subcomponents
function Stat({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number; sub: string; color: string }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className={`stat-circle-icon ${color}`}>{icon}</div>
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub">{sub}</div>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  currentUser,
  onBorrow,
  onEdit,
  onDelete
}: {
  item: Item;
  currentUser: User | null;
  onBorrow: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}) {
  const Icon = departmentIcon[item.department_name] || Package;
  const isMyDepartmentItem = currentUser?.role === "admin_departemen" && currentUser.department_id === item.department_id;
  const isAdminOtherDept = currentUser?.role === "admin_departemen" && currentUser.department_id !== item.department_id;
  const imgUrl = getItemImage(item);

  return (
    <div className="item-card" style={isMyDepartmentItem ? { borderColor: "var(--olive)" } : {}}>
      <div className="item-card-media">
        <span className="item-dept-chip">{item.department_name}</span>
        {imgUrl ? (
          <img src={imgUrl} alt={item.name} className="item-card-img" />
        ) : (
          <div className={`item-card-placeholder ${departmentColor[item.department_name] || "blue"}`}>
            <Icon size={30} />
          </div>
        )}
        <span className={`availability ${item.available_stock > 0 ? "available" : "unavailable"}`}>
          <i />
          {item.available_stock > 0 ? "Tersedia" : "Habis"}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span className="dashed-pill">{item.category}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-secondary)" }}>
          {item.available_stock} / {item.total_stock} unit
        </span>
      </div>

      <h3>{item.name}</h3>
      <p>{item.description || item.category}</p>

      <div className="stock-track" style={{ marginBottom: 14 }}>
        <div style={{ width: `${item.total_stock ? (item.available_stock / item.total_stock) * 100 : 0}%` }} />
      </div>

      {isMyDepartmentItem ? (
        <div className="item-manager-actions">
          <button className="btn btn-secondary btn-small" onClick={() => onEdit?.(item)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="icon-btn action-red" onClick={() => onDelete?.(item)} title="Hapus Barang">
            <Trash2 size={15} />
          </button>
        </div>
      ) : isAdminOtherDept ? (
        <div style={{ textAlign: "center", padding: "6px 0", fontSize: 11, color: "var(--ink-muted)", fontStyle: "italic" }}>
          Dikelola oleh Departemen {item.department_name}
        </div>
      ) : (
        <button className="btn btn-accent btn-full" disabled={item.available_stock === 0} onClick={() => onBorrow(item)}>
          {item.available_stock > 0 ? "Ajukan Peminjaman" : "Stok Habis"} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="empty-state">
      <div>
        <Package size={22} />
      </div>
      <span>{text}</span>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="modal">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
