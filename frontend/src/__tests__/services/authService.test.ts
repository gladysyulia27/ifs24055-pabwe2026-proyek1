import { describe, it, expect } from "vitest";
import {
  validateLoginPayload,
  validateRegisterPayload,
  transformUser
} from "@/services/authService";
import { User } from "@/types";

describe("Auth Service Logic", () => {
  describe("validateLoginPayload", () => {
    it("approves valid credentials", () => {
      const res = validateLoginPayload({
        username_or_email: "ifs24055",
        password: "password123"
      });
      expect(res.isValid).toBe(true);
      expect(res.error).toBeNull();
    });

    it("rejects empty identifier or password", () => {
      expect(validateLoginPayload({ username_or_email: "", password: "123" }).isValid).toBe(false);
      expect(validateLoginPayload({ username_or_email: "user", password: "" }).isValid).toBe(false);
    });
  });

  describe("validateRegisterPayload", () => {
    const validRegister = {
      username: "gladys27",
      email: "gladys@students.del.ac.id",
      password: "secretpassword",
      full_name: "Gladys Manurung",
      identifier: "11422001"
    };

    it("approves valid student registration", () => {
      expect(validateRegisterPayload(validRegister).isValid).toBe(true);
    });

    it("rejects short username", () => {
      expect(validateRegisterPayload({ ...validRegister, username: "ab" }).isValid).toBe(false);
    });

    it("rejects invalid email syntax", () => {
      expect(validateRegisterPayload({ ...validRegister, email: "invalid-email" }).isValid).toBe(
        false
      );
    });

    it("rejects short password", () => {
      expect(validateRegisterPayload({ ...validRegister, password: "123" }).isValid).toBe(false);
    });
  });

  describe("transformUser", () => {
    it("normalizes user fields with fallback defaults", () => {
      const rawUser: User = {
        id: 1,
        username: "ifs24055",
        email: "ifs24055@del.ac.id",
        full_name: "",
        identifier: "",
        role: "mahasiswa",
        department_id: null,
        department_name: null,
        contact_phone: ""
      };
      const transformed = transformUser(rawUser);
      expect(transformed.full_name).toBe("ifs24055");
      expect(transformed.identifier).toBe("-");
      expect(transformed.contact_phone).toBe("");
    });
  });
});
