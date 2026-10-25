export type Role = "mahasiswa" | "admin_departemen";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  identifier: string;
  role: Role;
  department_id: number | null;
  department_name: string | null;
  contact_phone: string;
}

export interface Department {
  id: number;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  inventory_count: number;
}

export interface Item {
  id: number;
  department_id: number;
  department_name: string;
  name: string;
  category: string;
  description: string;
  total_stock: number;
  available_stock: number;
  condition_status: string;
  image_url?: string;
}

export interface Loan {
  id: number;
  inventory_id: number;
  inventory_name: string;
  category?: string;
  department_name: string;
  borrower_name: string;
  borrower_id: string;
  borrower_contact: string;
  organization: string;
  purpose: string;
  quantity: number;
  start_date: string;
  due_date: string;
  status: LoanStatus;
  return_proof_url: string;
  return_note?: string;
  approved_by?: string;
  user_id?: number;
  created_at: string;
}

export type LoanStatus =
  | "Menunggu Approval"
  | "Disetujui"
  | "Ditolak"
  | "Menunggu Konfirmasi Pengembalian"
  | "Dikembalikan";

export interface Notice {
  id: number;
  borrower_name: string;
  inventory_name: string;
  department_name: string;
  due_date?: string;
}

export interface NotificationsData {
  due_returns: Notice[];
  pending: Notice[];
}

export interface ItemFormData {
  department_id: string;
  name: string;
  category: string;
  description: string;
  total_stock: string;
  condition_status: string;
  image_url?: string;
}

export interface LoanFormData {
  borrower_name: string;
  borrower_id: string;
  borrower_contact: string;
  organization: string;
  purpose: string;
  quantity: string;
  start_date: string;
  due_date: string;
}

export type PageKey = "Dashboard" | "Inventori" | "Peminjaman" | "Kalender" | "Notifikasi" | "Departemen" | "Profil";

export type LoanAction = "approve" | "reject" | "confirm-return";

export interface LoginCredentials {
  username_or_email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  full_name: string;
  identifier: string;
  contact_phone?: string;
}

export interface ItemPayload {
  department_id: number;
  name: string;
  category?: string;
  description?: string;
  total_stock: number;
  condition_status?: string;
  image_url?: string;
}

export interface LoanPayload {
  inventory_id: number;
  borrower_name: string;
  borrower_id: string;
  borrower_contact?: string;
  organization?: string;
  purpose: string;
  quantity: number;
  start_date: string;
  due_date: string;
}

// ============================================================================
// STRICT API CONTRACTS & SERVICE LAYER DATA TRANSFORMATION TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}

export interface ApiErrorData {
  error?: string;
  message?: string;
  details?: Record<string, string[]>;
  code?: string;
}

export interface TransformedItem extends Item {
  stockPercent: number;
  isAvailable: boolean;
  statusBadgeClass: string;
  displayImageUrl: string;
}

export interface TransformedLoan extends Loan {
  isOverdue: boolean;
  formattedStartDate: string;
  formattedDueDate: string;
  statusClass: string;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/** Type guard to verify if an object conforms to User shape */
export function isUser(data: unknown): data is User {
  if (typeof data !== "object" || data === null) return false;
  const u = data as Record<string, unknown>;
  return (
    typeof u.id === "number" &&
    typeof u.username === "string" &&
    typeof u.email === "string" &&
    typeof u.full_name === "string" &&
    typeof u.role === "string"
  );
}

/** Type guard to verify if an object conforms to Item shape */
export function isItem(data: unknown): data is Item {
  if (typeof data !== "object" || data === null) return false;
  const item = data as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    typeof item.department_id === "number" &&
    typeof item.name === "string" &&
    typeof item.total_stock === "number"
  );
}

/** Type guard to verify if an object conforms to Loan shape */
export function isLoan(data: unknown): data is Loan {
  if (typeof data !== "object" || data === null) return false;
  const loan = data as Record<string, unknown>;
  return (
    typeof loan.id === "number" &&
    typeof loan.inventory_id === "number" &&
    typeof loan.borrower_name === "string" &&
    typeof loan.start_date === "string" &&
    typeof loan.due_date === "string" &&
    typeof loan.status === "string"
  );
}

/** Type guard to verify if an object conforms to Department shape */
export function isDepartment(data: unknown): data is Department {
  if (typeof data !== "object" || data === null) return false;
  const dept = data as Record<string, unknown>;
  return (
    typeof dept.id === "number" &&
    typeof dept.name === "string"
  );
}

