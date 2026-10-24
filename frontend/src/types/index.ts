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

export type PageKey = "Dashboard" | "Inventori" | "Peminjaman" | "Kalender" | "Notifikasi" | "Departemen";

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
