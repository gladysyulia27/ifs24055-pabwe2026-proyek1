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

    it("rejects invalid email formats and empty input", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("a".repeat(101))).toBe(false);
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

    it("rejects invalid characters, empty input, and out-of-range lengths", () => {
      expect(isValidUsername("")).toBe(false);
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

    it("rejects empty fields in form", () => {
      expect(
        validateRegisterForm({
          username: "",
          email: "",
          password: "",
          full_name: "",
          identifier: ""
        })
      ).toBe("Username harus memiliki panjang antara 3 hingga 30 karakter.");
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

    it("rejects long username or invalid characters", () => {
      expect(validateRegisterForm({ ...validForm, username: "a".repeat(31) })).toBe(
        "Username harus memiliki panjang antara 3 hingga 30 karakter."
      );
      expect(validateRegisterForm({ ...validForm, username: "user@invalid!" })).toBe(
        "Username hanya boleh mengandung huruf, angka, titik (.), strip (-), atau garis bawah (_)."
      );
    });

    it("rejects email exceeding 100 characters", () => {
      expect(validateRegisterForm({ ...validForm, email: "a".repeat(95) + "@del.ac.id" })).toContain(
        "Format alamat email tidak valid"
      );
    });

    it("rejects password exceeding 128 characters", () => {
      expect(validateRegisterForm({ ...validForm, password: "a".repeat(129) })).toBe(
        "Password maksimal 128 karakter."
      );
    });

    it("rejects full name that is too short or too long", () => {
      expect(validateRegisterForm({ ...validForm, full_name: "A" })).toBe(
        "Nama lengkap harus memiliki panjang antara 2 hingga 100 karakter."
      );
      expect(validateRegisterForm({ ...validForm, full_name: "A".repeat(101) })).toBe(
        "Nama lengkap harus memiliki panjang antara 2 hingga 100 karakter."
      );
    });

    it("rejects identifier that is out of bounds or contains invalid symbols", () => {
      expect(validateRegisterForm({ ...validForm, identifier: "12" })).toBe(
        "NIM/NIP harus memiliki panjang antara 3 hingga 30 karakter."
      );
      expect(validateRegisterForm({ ...validForm, identifier: "1".repeat(31) })).toBe(
        "NIM/NIP harus memiliki panjang antara 3 hingga 30 karakter."
      );
      expect(validateRegisterForm({ ...validForm, identifier: "NIM@#$%" })).toBe(
        "Format NIM/NIP tidak valid (hanya alfanumerik, strip, garis miring, atau titik)."
      );
    });

    it("validates optional phone number when present", () => {
      expect(validateRegisterForm({ ...validForm, contact_phone: "08123456789" })).toBeNull();
      expect(validateRegisterForm({ ...validForm, contact_phone: "invalid-phone" })).toBe(
        "Format nomor kontak tidak valid (contoh: 08123456789 atau +628123456789)."
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
      expect(validateItemForm({ name: "", total_stock: "5" })).toBe("Nama barang wajib diisi.");
    });

    it("rejects negative or invalid stock", () => {
      expect(validateItemForm({ name: "Kamera", total_stock: "-1" })).toBe(
        "Stok harus berupa bilangan bulat non-negatif."
      );
      expect(validateItemForm({ name: "Kamera", total_stock: "abc" })).toBe(
        "Stok harus berupa bilangan bulat non-negatif."
      );
      expect(validateItemForm({ name: "Kamera", total_stock: 2.5 })).toBe(
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
      expect(validateLoanForm({ ...validLoan, quantity: "1.5" })).toBe(
        "Jumlah pinjam minimal 1 unit."
      );
    });

    it("rejects quantity exceeding available stock", () => {
      expect(validateLoanForm({ ...validLoan, quantity: "6" })).toBe(
        "Stok tersedia hanya 5 unit."
      );
    });

    it("rejects missing dates", () => {
      expect(validateLoanForm({ ...validLoan, start_date: "" })).toBe(
        "Tanggal mulai dan batas pengembalian wajib ditentukan."
      );
      expect(validateLoanForm({ ...validLoan, due_date: "" })).toBe(
        "Tanggal mulai dan batas pengembalian wajib ditentukan."
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
    it("strips script tags and encodes dangerous HTML characters", () => {
      expect(sanitizeInput("<script>alert('xss')</script>Kamera")).toBe("Kamera");
      expect(sanitizeInput("<b>Proyektor</b>")).toBe("&lt;b&gt;Proyektor&lt;&#x2F;b&gt;");
      expect(sanitizeInput('<a href="test&value">Link</a>')).toBe('&lt;a href=&quot;test&amp;value&quot;&gt;Link&lt;&#x2F;a&gt;');
      expect(sanitizeInput("It's a test")).toBe("It&#x27;s a test");
    });

    it("strips inline event handlers, style tags, and pseudo-protocols", () => {
      expect(sanitizeInput('<img src="x" onerror="alert(1)">')).toBe('&lt;img src=&quot;x&quot; &gt;');
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('vbscript:msgbox(1)')).toBe('msgbox(1)');
      expect(sanitizeInput('<style>body { color: red; }</style>Text')).toBe('Text');
    });

    it("handles empty or non-string gracefully", () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput("   Halo BEM  ")).toBe("Halo BEM");
    });
  });
});
