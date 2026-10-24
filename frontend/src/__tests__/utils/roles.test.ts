import { describe, it, expect } from "vitest";
import { getUserInitials, isDepartmentAdmin, isStudent } from "@/utils/roles";
import { User } from "@/types";

describe("Roles and User Utilities", () => {
  const adminUser: User = {
    id: 1,
    username: "admin_kominfo",
    email: "kominfo@del.ac.id",
    full_name: "Gladys Manurung",
    identifier: "ADM-01",
    role: "admin_departemen",
    department_id: 1,
    department_name: "DEPKOMINFO",
    contact_phone: "081234567890"
  };

  const studentUser: User = {
    id: 2,
    username: "ifs24055",
    email: "ifs24055@students.del.ac.id",
    full_name: "Budi Santoso",
    identifier: "11422002",
    role: "mahasiswa",
    department_id: null,
    department_name: null,
    contact_phone: "081298765432"
  };

  describe("isDepartmentAdmin & isStudent", () => {
    it("identifies department admins correctly", () => {
      expect(isDepartmentAdmin(adminUser)).toBe(true);
      expect(isDepartmentAdmin(studentUser)).toBe(false);
      expect(isDepartmentAdmin(null)).toBe(false);
    });

    it("identifies students correctly", () => {
      expect(isStudent(studentUser)).toBe(true);
      expect(isStudent(adminUser)).toBe(false);
      expect(isStudent(null)).toBe(false);
    });
  });

  describe("getUserInitials", () => {
    it("returns PJ badge for department admins", () => {
      expect(getUserInitials(adminUser)).toBe("PJ");
    });

    it("returns M badge for student users", () => {
      expect(getUserInitials(studentUser)).toBe("M");
    });
  });
});
