import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidIdentifier,
  validateLoginForm,
  validateRegisterForm,
  validateItemForm,
  validateLoanForm
} from "@/utils/validation";

describe("Validation Utilities", () => {
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
        "Username minimal 3 karakter."
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
        "Stok total harus berupa bilangan bulat lebih besar atau sama dengan 0."
      );
      expect(validateItemForm({ name: "Kamera", total_stock: "abc" })).toBe(
        "Stok total harus berupa bilangan bulat lebih besar atau sama dengan 0."
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
        "Jumlah barang harus berupa bilangan bulat minimal 1 unit."
      );
    });

    it("rejects quantity exceeding available stock", () => {
      expect(validateLoanForm({ ...validLoan, quantity: "6" })).toBe(
        "Jumlah peminjaman (6 unit) melebihi stok yang tersedia (5 unit)."
      );
    });

    it("rejects due date prior to start date", () => {
      expect(
        validateLoanForm({
          ...validLoan,
          start_date: "2026-10-28",
          due_date: "2026-10-25"
        })
      ).toBe("Batas tanggal kembali tidak boleh lebih awal dari tanggal mulai peminjaman.");
    });
  });
});
