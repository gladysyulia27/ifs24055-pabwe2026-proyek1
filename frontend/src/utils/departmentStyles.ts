import {
  Camera,
  Computer,
  Flower2,
  Users,
  ClipboardList,
  Mic,
  Volleyball,
  ShieldAlert,
  Music2,
  Package
} from "lucide-react";

export const departmentColor: Record<string, string> = {
  DEPKOMINFO: "blue",
  DIPTEK: "purple",
  DEPAGSOS: "pink",
  DPDK: "amber",
  DHPM: "teal",
  DESARPRAS: "orange",
  DEPOL: "green",
  DEKEBDIS: "slate",
  DEPSENBUD: "rose"
};

export const departmentIcon: Record<string, any> = {
  DEPKOMINFO: Camera,
  DIPTEK: Computer,
  DEPAGSOS: Flower2,
  DPDK: Users,
  DHPM: ClipboardList,
  DESARPRAS: Mic,
  DEPOL: Volleyball,
  DEKEBDIS: ShieldAlert,
  DEPSENBUD: Music2
};

export function getDepartmentIcon(deptName?: string) {
  if (!deptName) return Package;
  return departmentIcon[deptName] || Package;
}
