/**
 * roles — Role-based permission helpers for the frontend.
 *
 * Provides lightweight predicates (`isDepartmentAdmin`, `isStudent`) and
 * display helpers (`getUserInitials`) that encapsulate role-string comparisons
 * so they are not scattered across components.
 */
import { User } from "@/types";

export const isDepartmentAdmin = (user?: User | null): boolean => user?.role === "admin_departemen";

export const isStudent = (user?: User | null): boolean => user?.role === "mahasiswa";

/** Two-letter badge shown in avatars. */
export const getUserInitials = (user: User): string => (isDepartmentAdmin(user) ? "PJ" : "M");
