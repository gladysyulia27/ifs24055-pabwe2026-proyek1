import { Boxes, CalendarDays, ClipboardList, LayoutDashboard, LucideIcon, Package } from "lucide-react";
import { PageKey, User } from "@/types";
import { isDepartmentAdmin } from "@/utils/roles";

export interface NavItem {
  page: PageKey;
  label: string;
  icon: LucideIcon;
}

export const DEFAULT_PAGE: PageKey = "Dashboard";

export function getNavItems(user: User | null): NavItem[] {
  return [
    { page: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { page: "Inventori", label: "Inventori", icon: Package },
    {
      page: "Peminjaman",
      label: isDepartmentAdmin(user) ? "Persetujuan Peminjaman" : "Peminjaman Saya",
      icon: ClipboardList
    },
    { page: "Kalender", label: "Kalender", icon: CalendarDays },
    { page: "Departemen", label: "Departemen", icon: Boxes }
  ];
}
