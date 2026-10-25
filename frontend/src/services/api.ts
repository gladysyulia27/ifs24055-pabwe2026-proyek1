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

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ifs24055-pabwe2026-proyek1-backend.vercel.app/api";

const TOKEN_KEYS = ["bem_inventory_token", "token", "authToken"];
const USER_KEY = "bem_user";

let inMemoryToken: string | null = null;

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return inMemoryToken;
  // 1. Check document cookies across standard key aliases
  try {
    for (const key of TOKEN_KEYS) {
      const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`));
      if (match) {
        const token = decodeURIComponent(match[1]);
        inMemoryToken = token;
        return token;
      }
    }
  } catch {
    // Cookie read blocked
  }

  // 2. Check localStorage across standard aliases
  try {
    for (const key of TOKEN_KEYS) {
      const local = localStorage.getItem(key);
      if (local) {
        inMemoryToken = local;
        return local;
      }
    }
  } catch {
    // LocalStorage blocked
  }

  return inMemoryToken;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  // 1. Try localStorage
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {
    // ignore
  }
  // 2. Try cookie
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${USER_KEY}=([^;]+)`));
    if (match) {
      return JSON.parse(decodeURIComponent(match[1])) as User;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setStoredUser(user: User): void {
  if (typeof window !== "undefined") {
    const serialized = encodeURIComponent(JSON.stringify(user));
    try {
      document.cookie = `${USER_KEY}=${serialized}; path=/; max-age=604800`;
      document.cookie = `${USER_KEY}=${serialized}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      // ignore
    }
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }
}

export function setStoredToken(token: string): void {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    const encoded = encodeURIComponent(token);
    for (const key of TOKEN_KEYS) {
      try {
        document.cookie = `${key}=${encoded}; path=/; max-age=604800`;
        document.cookie = `${key}=${encoded}; path=/; max-age=604800; SameSite=Lax`;
      } catch {
        // ignore
      }
      try {
        localStorage.setItem(key, token);
      } catch {
        // ignore
      }
    }
  }
}

export function removeStoredToken(): void {
  inMemoryToken = null;
  if (typeof window !== "undefined") {
    for (const key of TOKEN_KEYS) {
      try {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      } catch {
        // ignore
      }
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    try {
      document.cookie = `${USER_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
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
