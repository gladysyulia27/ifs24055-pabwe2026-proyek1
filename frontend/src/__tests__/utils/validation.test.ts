import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidUsername,
  isValidIdentifier,
  isValidPhone,
  validateLoginForm,
  validateRegisterForm,
  validateItemForm,
  validateLoanForm,
  sanitizeInput
} from "@/utils/validation";

describe("Validation Utilities (Synchronized with Backend)", () => {
  describe("isValidEmail", () => {
    it("validates correct email addresses", () => {
      expect(isValidEmail("user@del.ac.id")).toBe(true);
      expect(isValidEmail("student@gmail.com")).toBe(true);
    });

    it("rejects invalid email formats", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@del.ac.id")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });
  });

  describe("isValidUsername", () => {
    it("approves alphanumeric characters, dots, dashes, and underscores", () => {
      expect(isValidUsername("gladys27")).toBe(true);
      expect(isValidUsername("user.name")).toBe(true);
      expect(isValidUsername("admin-01")).toBe(true);
      expect(isValidUsername("user_del")).toBe(true);
    });

    it("rejects invalid characters and out-of-range lengths", () => {
      expect(isValidUsername("ab")).toBe(false); // too short
      expect(isValidUsername("user@name")).toBe(false); // invalid symbol
      expect(isValidUsername("a".repeat(31))).toBe(false); // too long
    });
  });

  describe("isValidIdentifier", () => {
    it("validates Del student NIM or staff ID", () => {
      expect(isValidIdentifier("11422001")).toBe(true);
      expect(isValidIdentifier("ADM-01")).toBe(true);
    });

    it("rejects short or empty identifiers", () => {
      expect(isValidIdentifier("ab")).toBe(false);
      expect(isValidIdentifier("")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("accepts valid phone strings", () => {
      expect(isValidPhone("081234567890")).toBe(true);
      expect(isValidPhone("+62 812-3456-7890")).toBe(true);
      expect(isValidPhone("")).toBe(true); // optional
    });

    it("rejects invalid phone characters", () => {
      expect(isValidPhone("123")).toBe(false); // too short
      expect(isValidPhone("0812abc345")).toBe(false);
    });
  });

  describe("validateLoginForm", () => {
    it("approves non-empty username/email and password", () => {
      expect(validateLoginForm("ifs24055", "password123")).toBeNull();
    });

    it("rejects missing username or password", () => {
      expect(validateLoginForm("", "pass")).toBe("Username atau Email wajib diisi.");
      expect(validateLoginForm("user", "")).toBe("Password wajib diisi.");
    });
  });

  describe("validateRegisterForm", () => {
    const validForm = {
      username: "gladys27",
      email: "gladys@del.ac.id",
      password: "password123",
      full_name: "Gladys Manurung",
      identifier: "11422001"
    };

    it("approves valid register form", () => {
      expect(validateRegisterForm(validForm)).toBeNull();
    });

    it("rejects short username", () => {
      expect(validateRegisterForm({ ...validForm, username: "ab" })).toBe(
        "Username harus memiliki panjang antara 3 hingga 30 karakter."
      );
    });

    it("rejects invalid email format", () => {
      expect(validateRegisterForm({ ...validForm, email: "invalid" })).toContain(
        "Format alamat email tidak valid"
      );
    });

    it("rejects short password", () => {
      expect(validateRegisterForm({ ...validForm, password: "123" })).toBe(
        "Password minimal 6 karakter."
      );
    });
  });

  describe("validateItemForm", () => {
    it("accepts valid item data", () => {
      expect(validateItemForm({ name: "Kamera Sony A7", total_stock: "5" })).toBeNull();
      expect(validateItemForm({ name: "Proyektor", total_stock: 0 })).toBeNull();
    });

    it("rejects empty item name", () => {
      expect(validateItemForm({ name: "   ", total_stock: "5" })).toBe("Nama barang wajib diisi.");
    });

    it("rejects negative or invalid stock", () => {
      expect(validateItemForm({ name: "Kamera", total_stock: "-1" })).toBe(
        "Stok harus berupa bilangan bulat non-negatif."
      );
      expect(validateItemForm({ name: "Kamera", total_stock: "abc" })).toBe(
        "Stok harus berupa bilangan bulat non-negatif."
      );
    });
  });

  describe("validateLoanForm", () => {
    const validLoan = {
      purpose: "Dokumentasi Acara Dies Natalis",
      quantity: "1",
      start_date: "2026-10-25",
      due_date: "2026-10-27",
      maxAvailableStock: 5
    };

    it("accepts valid loan form", () => {
      expect(validateLoanForm(validLoan)).toBeNull();
    });

    it("rejects missing loan purpose", () => {
      expect(validateLoanForm({ ...validLoan, purpose: "" })).toBe(
        "Tujuan peminjaman wajib diisi."
      );
    });

    it("rejects zero or negative quantity", () => {
      expect(validateLoanForm({ ...validLoan, quantity: "0" })).toBe(
        "Jumlah pinjam minimal 1 unit."
      );
    });

    it("rejects quantity exceeding available stock", () => {
      expect(validateLoanForm({ ...validLoan, quantity: "6" })).toBe(
        "Stok tersedia hanya 5 unit."
      );
    });

    it("rejects due date prior to start date", () => {
      expect(
        validateLoanForm({
          ...validLoan,
          start_date: "2026-10-28",
          due_date: "2026-10-25"
        })
      ).toBe("Tanggal pengembalian harus sama atau setelah tanggal pinjam.");
    });
  });

  describe("sanitizeInput (XSS prevention)", () => {
    it("strips script tags and angular braces", () => {
      expect(sanitizeInput("<script>alert('xss')</script>Kamera")).toBe("Kamera");
      expect(sanitizeInput("<b>Proyektor</b>")).toBe("bProyektor/b");
    });

    it("handles empty or non-string gracefully", () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput("   Halo BEM  ")).toBe("Halo BEM");
    });
  });
});
