import { Department, Item, Loan, NotificationsData, User } from "@/types";

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

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init?.headers as Record<string, string>) || {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Terjadi kesalahan saat memproses permintaan.");
  }

  return data as T;
}

// Auth API
export const authApi = {
  login: async (body: { username_or_email: string; password: string }) => {
    return request<{ message: string; token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  register: async (body: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    identifier: string;
    role?: string;
    department_id?: number | null;
    contact_phone?: string;
  }) => {
    return request<{ message: string; token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  getMe: async () => {
    return request<{ user: User }>("/auth/me");
  },

  logout: async () => {
    return request<{ message: string }>("/auth/logout", {
      method: "POST"
    });
  },

  getDemoAccounts: async () => {
    return request<User[]>("/auth/demo-accounts");
  }
};

// Inventory API
export const inventoryApi = {
  getAll: async (departmentId?: number, search?: string) => {
    const params = new URLSearchParams();
    if (departmentId) params.append("departmentId", String(departmentId));
    if (search) params.append("search", search);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return request<Item[]>(`/inventory${qs}`);
  },

  create: async (body: {
    department_id: number;
    name: string;
    category?: string;
    description?: string;
    total_stock: number;
    condition_status?: string;
    image_url?: string;
  }) => {
    return request<Item>("/inventory", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  update: async (
    id: number,
    body: {
      name?: string;
      category?: string;
      description?: string;
      condition_status?: string;
      total_stock?: number;
      image_url?: string;
    }
  ) => {
    return request<Item>(`/inventory/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  },

  delete: async (id: number) => {
    return request<{ success: boolean; message: string }>(`/inventory/${id}`, {
      method: "DELETE"
    });
  }
};

// Departments API
export const departmentsApi = {
  getAll: async () => {
    return request<Department[]>("/departments");
  }
};

// Loans API
export const loansApi = {
  getAll: async (status?: string, departmentId?: number) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (departmentId) params.append("departmentId", String(departmentId));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return request<Loan[]>(`/loans${qs}`);
  },

  getCalendar: async (month?: string) => {
    const qs = month ? `?month=${month}` : "";
    return request<Loan[]>(`/loans/calendar${qs}`);
  },

  create: async (body: {
    inventory_id: number;
    borrower_name: string;
    borrower_id: string;
    borrower_contact?: string;
    organization?: string;
    purpose: string;
    quantity: number;
    start_date: string;
    due_date: string;
  }) => {
    return request<Loan>("/loans", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  action: async (id: number, action: "approve" | "reject" | "confirm-return", approvedBy?: string) => {
    return request<Loan>(`/loans/${id}/${action}`, {
      method: "PATCH",
      body: JSON.stringify({ approved_by: approvedBy })
    });
  },

  submitReturn: async (id: number, returnProofUrl: string, returnNote?: string) => {
    return request<Loan>(`/loans/${id}/return`, {
      method: "PATCH",
      body: JSON.stringify({
        return_proof_url: returnProofUrl,
        return_note: returnNote || ""
      })
    });
  }
};

// Notifications API
export const notificationsApi = {
  getNotifications: async () => {
    return request<NotificationsData>("/notifications");
  }
};
