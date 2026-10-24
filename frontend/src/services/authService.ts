/**
 * authService — Client-side authentication service layer.
 *
 * Validates credentials and registration payloads before they reach the API,
 * transforms raw API responses into normalized User objects, and encapsulates
 * all auth-related network calls (login, register, logout, getMe).
 */
import { LoginCredentials, RegisterPayload, User, ValidationResult } from "@/types";
import { authApi } from "./api";
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
