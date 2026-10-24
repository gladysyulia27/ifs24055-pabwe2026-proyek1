/**
 * authService — Client-side authentication service layer.
 *
 * Validates credentials and registration payloads before they reach the API,
 * transforms raw API responses into normalized User objects, and encapsulates
 * all auth-related network calls (login, register, logout, getMe).
 */
import { LoginCredentials, RegisterPayload, User, ValidationResult } from "@/types";
import { authApi } from "./api";
import { handleServiceError } from "./errorHandler";
import { validateLoginForm, validateRegisterForm } from "@/utils/validation";

/**
 * Validates login credentials format strictly aligned with server rules.
 */
export function validateLoginPayload(payload: LoginCredentials): ValidationResult {
  const error = validateLoginForm(payload.username_or_email, payload.password);
  return { isValid: !error, error };
}

/**
 * Validates registration payload according to strict server requirements.
 */
export function validateRegisterPayload(payload: RegisterPayload): ValidationResult {
  const error = validateRegisterForm(payload);
  return { isValid: !error, error };
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
    try {
      const validation = validateLoginPayload(credentials);
      if (!validation.isValid) {
        throw new Error(validation.error || "Validasi kredensial login gagal.");
      }

      const res = await authApi.login(credentials);
      return {
        ...res,
        user: transformUser(res.user)
      };
    } catch (err: unknown) {
      return handleServiceError(err, "Gagal melakukan proses masuk (login).");
    }
  },

  /**
   * Performs user registration with client-side field validation.
   */
  async register(
    payload: RegisterPayload & { role?: string; department_id?: number | null }
  ): Promise<{ message: string; token: string; user: User }> {
    try {
      const validation = validateRegisterPayload(payload);
      if (!validation.isValid) {
        throw new Error(validation.error || "Validasi pendaftaran akun gagal.");
      }

      const res = await authApi.register(payload);
      return {
        ...res,
        user: transformUser(res.user)
      };
    } catch (err: unknown) {
      return handleServiceError(err, "Gagal melakukan pendaftaran akun baru.");
    }
  },

  /**
   * Fetches current authenticated user profile.
   */
  async getMe(): Promise<User> {
    try {
      const res = await authApi.getMe();
      return transformUser(res.user);
    } catch (err: unknown) {
      return handleServiceError(err, "Gagal mengambil data profil pengguna aktif.");
    }
  },

  /**
   * Logs out the current session.
   */
  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch (err: unknown) {
      return handleServiceError(err, "Gagal keluar dari sesi login.");
    }
  },

  /**
   * Fetches available demo accounts for testing and quick sign-in.
   */
  async getDemoAccounts(): Promise<User[]> {
    try {
      const accounts = await authApi.getDemoAccounts();
      return accounts.map(transformUser);
    } catch (err: unknown) {
      return handleServiceError(err, "Gagal mengambil daftar akun demo.");
    }
  }
};
