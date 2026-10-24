import {
  ApiErrorData,
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

/**
 * Retrieves authentication token.
 * Prefers Secure Cookie for CSRF/XSS resistance, falling back to local storage if cookies disabled.
 * Note: When backend supports Set-Cookie with httpOnly, tokens are transported automatically.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  // 1. Check document cookie
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${TOKEN_KEY}=([^;]+)`));
  if (match) return decodeURIComponent(match[2]);
  // 2. Safe fallback
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    // Set cookie with SameSite and secure path
    const isSecure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${isSecure}`;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // In case localStorage is blocked by user privacy settings
    }
  }
}

export function removeStoredToken(): void {
  if (typeof window !== "undefined") {
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // safe fallback
    }
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

export class ApiError extends Error {
  status: number;
  data: unknown;
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor(
    message: string,
    status = 0,
    data?: unknown,
    isNetworkError = false,
    isTimeout = false
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init?.headers as Record<string, string>) || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      signal: init?.signal || controller.signal
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(
        "Permintaan melebihi batas waktu (15 detik). Silakan periksa koneksi atau coba beberapa saat lagi.",
        408,
        null,
        false,
        true
      );
    }
    throw new ApiError(
      "Tidak dapat terhubung ke server backend API. Pastikan server backend sedang aktif atau periksa koneksi jaringan Anda.",
      0,
      null,
      true
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // Parse response body secara aman
  let data: ApiErrorData | null = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = (await response.json()) as ApiErrorData;
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  // Tangani 401 Unauthorized (token kedaluwarsa atau sesi tidak valid)
  if (response.status === 401) {
    removeStoredToken();
    const msg =
      typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string"
        ? data.message
        : "Sesi login Anda telah berakhir. Silakan masuk kembali.";
    throw new ApiError(msg, 401, data);
  }

  if (!response.ok) {
    let errorMsg =
      typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string"
        ? data.message
        : "";

    if (!errorMsg) {
      switch (response.status) {
        case 400:
          errorMsg = "Permintaan data tidak valid (Bad Request).";
          break;
        case 403:
          errorMsg = "Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.";
          break;
        case 404:
          errorMsg = "Data atau endpoint yang diminta tidak ditemukan dalam sistem.";
          break;
        case 409:
          errorMsg = "Terjadi konflik data pada server.";
          break;
        case 422:
          errorMsg = "Data yang dikirimkan tidak memenuhi syarat validasi.";
          break;
        case 500:
          errorMsg = "Terjadi gangguan internal pada server backend.";
          break;
        case 502:
        case 503:
        case 504:
          errorMsg = "Layanan backend sedang tidak tersedia atau dalam pemeliharaan.";
          break;
        default:
          errorMsg = `Permintaan gagal dengan status ${response.status} (${response.statusText || "Error"}).`;
      }
    }

    throw new ApiError(errorMsg, response.status, data);
  }

  return (data as unknown) as T;
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
