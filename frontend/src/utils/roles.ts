import { User } from "@/types";

export const isDepartmentAdmin = (user?: User | null): boolean => user?.role === "admin_departemen";

export const isStudent = (user?: User | null): boolean => user?.role === "mahasiswa";

/** Two-letter badge shown in avatars. */
export const getUserInitials = (user: User): string => (isDepartmentAdmin(user) ? "PJ" : "M");
