import {
  Department,
  Item,
  ItemPayload,
  Loan,
  LoanAction,
  LoanPayload,
  LoginCredentials,
  NotificationsData,
  RegisterPayload,
  User
} from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const TOKEN_KEY = "bem_inventory_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

type QueryValue = string | number | undefined | null;

/** Builds a "?a=1&b=2" query string, skipping empty values. */
function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

function jsonBody(body: unknown): RequestInit {
  return { body: JSON.stringify(body) };
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init?.headers as Record<string, string>) || {})
  };

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Terjadi kesalahan saat memproses permintaan.");
  }

  return data as T;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authApi = {
  login: (body: LoginCredentials) =>
    request<AuthResponse>("/auth/login", { method: "POST", ...jsonBody(body) }),

  register: (body: RegisterPayload & { role?: string; department_id?: number | null }) =>
    request<AuthResponse>("/auth/register", { method: "POST", ...jsonBody(body) }),

  getMe: () => request<{ user: User }>("/auth/me"),

  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),

  getDemoAccounts: () => request<User[]>("/auth/demo-accounts")
};

export const inventoryApi = {
  getAll: (departmentId?: number, search?: string) =>
    request<Item[]>(`/inventory${buildQuery({ departmentId, search })}`),

  create: (body: ItemPayload) =>
    request<Item>("/inventory", { method: "POST", ...jsonBody(body) }),

  update: (id: number, body: Partial<Omit<ItemPayload, "department_id">>) =>
    request<Item>(`/inventory/${id}`, { method: "PATCH", ...jsonBody(body) }),

  delete: (id: number) =>
    request<{ success: boolean; message: string }>(`/inventory/${id}`, { method: "DELETE" })
};

export const departmentsApi = {
  getAll: () => request<Department[]>("/departments")
};

export const loansApi = {
  getAll: (status?: string, departmentId?: number) =>
    request<Loan[]>(`/loans${buildQuery({ status, departmentId })}`),

  getCalendar: (month?: string) =>
    request<Loan[]>(`/loans/calendar${buildQuery({ month })}`),

  create: (body: LoanPayload) =>
    request<Loan>("/loans", { method: "POST", ...jsonBody(body) }),

  action: (id: number, action: LoanAction, approvedBy?: string) =>
    request<Loan>(`/loans/${id}/${action}`, {
      method: "PATCH",
      ...jsonBody({ approved_by: approvedBy })
    }),

  submitReturn: (id: number, returnProofUrl: string, returnNote = "") =>
    request<Loan>(`/loans/${id}/return`, {
      method: "PATCH",
      ...jsonBody({ return_proof_url: returnProofUrl, return_note: returnNote })
    })
};

export const notificationsApi = {
  getNotifications: () => request<NotificationsData>("/notifications")
};
