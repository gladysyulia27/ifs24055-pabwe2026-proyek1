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
      expect(transformed.department_name).toBeNull();
    });

    it("preserves trimmed values when user fields are provided", () => {
      const userWithFields: User = {
        id: 2,
        username: "admin_ti",
        email: "admin@del.ac.id",
        full_name: "  Admin TI  ",
        identifier: "  ADM001  ",
        role: "admin_departemen",
        department_id: 1,
        department_name: "  Teknologi Informasi  ",
        contact_phone: "  08123456789  "
      };
      const transformed = transformUser(userWithFields);
      expect(transformed.full_name).toBe("Admin TI");
      expect(transformed.identifier).toBe("ADM001");
      expect(transformed.department_name).toBe("Teknologi Informasi");
      expect(transformed.contact_phone).toBe("08123456789");
    });
  });

  describe("authService API methods", () => {
    const dummyUser: User = {
      id: 1,
      username: "ifs24055",
      email: "ifs24055@del.ac.id",
      full_name: "Gladys",
      identifier: "11422001",
      role: "mahasiswa",
      department_id: null,
      department_name: null,
      contact_phone: "08123456789"
    };

    it("login succeeds with valid credentials", async () => {
      const { authApi } = await import("@/services/api");
      vi.spyOn(authApi, "login").mockResolvedValue({
        message: "Login sukses",
        token: "jwt-token",
        user: dummyUser
      });

      const { authService } = await import("@/services/authService");
      const res = await authService.login({
        username_or_email: "ifs24055",
        password: "password123"
      });
      expect(res.token).toBe("jwt-token");
      expect(res.user.username).toBe("ifs24055");
    });

    it("login throws on validation failure", async () => {
      const { authService } = await import("@/services/authService");
      await expect(
        authService.login({ username_or_email: "", password: "" })
      ).rejects.toThrowError();
    });

    it("register succeeds with valid payload", async () => {
      const { authApi } = await import("@/services/api");
      vi.spyOn(authApi, "register").mockResolvedValue({
        message: "Register sukses",
        token: "jwt-token",
        user: dummyUser
      });

      const { authService } = await import("@/services/authService");
      const res = await authService.register({
        username: "gladys27",
        email: "gladys@del.ac.id",
        password: "secretpassword",
        full_name: "Gladys Manurung",
        identifier: "11422001"
      });
      expect(res.token).toBe("jwt-token");
    });

    it("register throws on validation failure", async () => {
      const { authService } = await import("@/services/authService");
      await expect(
        authService.register({
          username: "ab",
          email: "invalid",
          password: "123",
          full_name: "",
          identifier: ""
        })
      ).rejects.toThrow();
    });

    it("getMe fetches and transforms user profile", async () => {
      const { authApi } = await import("@/services/api");
      vi.spyOn(authApi, "getMe").mockResolvedValue({ user: dummyUser });

      const { authService } = await import("@/services/authService");
      const user = await authService.getMe();
      expect(user.username).toBe("ifs24055");
    });

    it("logout calls authApi.logout", async () => {
      const { authApi } = await import("@/services/api");
      vi.spyOn(authApi, "logout").mockResolvedValue();

      const { authService } = await import("@/services/authService");
      await expect(authService.logout()).resolves.toBeUndefined();
    });

    it("getDemoAccounts fetches and transforms demo user list", async () => {
      const { authApi } = await import("@/services/api");
      vi.spyOn(authApi, "getDemoAccounts").mockResolvedValue([dummyUser]);

      const { authService } = await import("@/services/authService");
      const accounts = await authService.getDemoAccounts();
      expect(accounts).toHaveLength(1);
    });

    it("handles API errors across auth methods", async () => {
      const { authApi } = await import("@/services/api");
      const { authService } = await import("@/services/authService");

      vi.spyOn(authApi, "login").mockRejectedValue(new Error("Login failed on server"));
      await expect(
        authService.login({ username_or_email: "validuser", password: "validpassword" })
      ).rejects.toThrowError();

      vi.spyOn(authApi, "register").mockRejectedValue(new Error("Register server error"));
      await expect(
        authService.register({
          username: "validuser",
          email: "valid@del.ac.id",
          password: "validpassword",
          full_name: "Valid User",
          identifier: "11422001"
        })
      ).rejects.toThrowError();

      vi.spyOn(authApi, "getMe").mockRejectedValue(new Error("Session expired"));
      await expect(authService.getMe()).rejects.toThrowError();

      vi.spyOn(authApi, "logout").mockRejectedValue(new Error("Logout error"));
      await expect(authService.logout()).rejects.toThrowError();

      vi.spyOn(authApi, "getDemoAccounts").mockRejectedValue(new Error("Failed fetching demo accounts"));
      await expect(authService.getDemoAccounts()).rejects.toThrowError();
    });
  });
});
