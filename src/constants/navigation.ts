import {
  Boxes,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
  Package,
  User as UserIcon,
  Bell
} from "lucide-react";
import { PageKey, User } from "@/types";
import { isDepartmentAdmin } from "@/utils/roles";

export interface NavItem {
  page: PageKey;
  path: string;
  label: string;
  icon: LucideIcon;
}

export const DEFAULT_PAGE: PageKey = "Dashboard";

export function getNavItems(user: User | null): NavItem[] {
  return [
    { page: "Dashboard", path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { page: "Inventori", path: "/inventory", label: "Inventori", icon: Package },
    {
      page: "Peminjaman",
      path: "/loans",
      label: isDepartmentAdmin(user) ? "Persetujuan Peminjaman" : "Peminjaman Saya",
      icon: ClipboardList
    },
    { page: "Kalender", path: "/calendar", label: "Kalender", icon: CalendarDays },
    { page: "Departemen", path: "/departments", label: "Departemen", icon: Boxes },
    { page: "Profil", path: "/profile", label: "Profil Akun", icon: UserIcon }
  ];
}
