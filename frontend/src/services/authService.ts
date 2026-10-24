import { LoginCredentials, RegisterPayload, User, ValidationResult } from "@/types";
import { authApi } from "./api";

/**
 * Validates login credentials format.
 */
export function validateLoginPayload(payload: LoginCredentials): ValidationResult {
  if (!payload.username_or_email || payload.username_or_email.trim().length === 0) {
    return { isValid: false, error: "Username atau email wajib diisi." };
  }

  if (!payload.password || payload.password.length === 0) {
    return { isValid: false, error: "Password wajib diisi." };
  }

  return { isValid: true, error: null };
}

/**
 * Validates registration payload according to academic requirements.
 */
export function validateRegisterPayload(payload: RegisterPayload): ValidationResult {
  if (!payload.username || payload.username.trim().length < 3) {
    return { isValid: false, error: "Username minimal 3 karakter." };
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    return { isValid: false, error: "Format alamat email tidak valid." };
  }

  if (!payload.password || payload.password.length < 6) {
    return { isValid: false, error: "Password akun minimal 6 karakter." };
  }

  if (!payload.full_name || payload.full_name.trim().length === 0) {
    return { isValid: false, error: "Nama lengkap mahasiswa wajib diisi." };
  }

  if (!payload.identifier || payload.identifier.trim().length === 0) {
    return { isValid: false, error: "NIM / Nomor Identitas resmi wajib diisi." };
  }

  return { isValid: true, error: null };
}

/**
 * Transforms and normalizes a User profile object.
 */
export function transformUser(user: User): User {
  return {
    ...user,
    full_name: user.full_name?.trim() || user.username,
    identifier: user.identifier?.trim() || "-",
    contact_phone: user.contact_phone?.trim() || "",
    department_name: user.department_name ? user.department_name.trim() : null
  };
}

/**
 * Auth Service Layer managing authentication validation and user session state.
 */
export const authService = {
  /**
   * Performs user login with client-side credential validation.
   */
  async login(credentials: LoginCredentials): Promise<{ message: string; token: string; user: User }> {
    const validation = validateLoginPayload(credentials);
    if (!validation.isValid) {
      throw new Error(validation.error || "Validasi kredensial login gagal.");
    }

    const res = await authApi.login(credentials);
    return {
      ...res,
      user: transformUser(res.user)
    };
  },

  /**
   * Performs user registration with client-side field validation.
   */
  async register(
    payload: RegisterPayload & { role?: string; department_id?: number | null }
  ): Promise<{ message: string; token: string; user: User }> {
    const validation = validateRegisterPayload(payload);
    if (!validation.isValid) {
      throw new Error(validation.error || "Validasi pendaftaran akun gagal.");
    }

    const res = await authApi.register(payload);
    return {
      ...res,
      user: transformUser(res.user)
    };
  },

  /**
   * Fetches current authenticated user profile.
   */
  async getMe(): Promise<User> {
    const res = await authApi.getMe();
    return transformUser(res.user);
  },

  /**
   * Logs out the current session.
   */
  async logout(): Promise<void> {
    await authApi.logout();
  },

  /**
   * Fetches available demo accounts for testing and quick sign-in.
   */
  async getDemoAccounts(): Promise<User[]> {
    const accounts = await authApi.getDemoAccounts();
    return accounts.map(transformUser);
  }
};
