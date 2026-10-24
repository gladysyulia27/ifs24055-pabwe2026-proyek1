import { describe, it, expect } from "vitest";
import {
  validateLoanPayload,
  validateReturnProofPayload,
  transformLoan
} from "@/services/loanService";
import { Loan, LoanPayload } from "@/types";

describe("Loan Service Logic", () => {
  describe("validateLoanPayload", () => {
    const validPayload: LoanPayload = {
      inventory_id: 1,
      borrower_name: "Gladys Manurung",
      borrower_id: "11422001",
      borrower_contact: "081234567890",
      organization: "BEM",
      purpose: "Rapat Kerja",
      quantity: 1,
      start_date: "2026-10-25",
      due_date: "2026-10-26"
    };

    it("approves valid loan payload", () => {
      const res = validateLoanPayload(validPayload);
      expect(res.isValid).toBe(true);
      expect(res.error).toBeNull();
    });

    it("rejects non-positive quantity", () => {
      const res = validateLoanPayload({ ...validPayload, quantity: 0 });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe("Jumlah pinjam minimal 1 unit.");
    });

    it("rejects invalid date range", () => {
      const res = validateLoanPayload({
        ...validPayload,
        start_date: "2026-10-27",
        due_date: "2026-10-25"
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe("Tanggal pengembalian harus sama atau setelah tanggal pinjam.");
    });
  });

  describe("validateReturnProofPayload", () => {
    it("approves non-empty proof URL", () => {
      const res = validateReturnProofPayload("data:image/jpeg;base64,12345");
      expect(res.isValid).toBe(true);
    });

    it("rejects empty proof URL", () => {
      const res = validateReturnProofPayload("");
      expect(res.isValid).toBe(false);
      expect(res.error).toBe("Bukti dokumentasi foto fisik pengembalian barang wajib disertakan.");
    });
  });

  describe("transformLoan", () => {
    const mockLoan: Loan = {
      id: 5,
      inventory_id: 1,
      inventory_name: "Mic Wireless",
      department_name: "DESARPRAS",
      borrower_name: "Gladys Manurung",
      borrower_id: "11422001",
      borrower_contact: "081234567890",
      organization: "BEM",
      purpose: "Acara Kampus",
      quantity: 2,
      start_date: "2026-10-20",
      due_date: "2026-10-22",
      status: "Disetujui",
      return_proof_url: "",
      created_at: "2026-10-19"
    };

    it("formats dates and detects overdue status appropriately", () => {
      const transformed = transformLoan(mockLoan);
      expect(transformed.formattedStartDate).toBeTruthy();
      expect(transformed.formattedDueDate).toBeTruthy();
      expect(transformed.statusClass).toBe("status status-green");
      expect(transformed.isOverdue).toBe(true);
    });

    it("does not flag overdue for returned items", () => {
      const returnedLoan: Loan = {
        ...mockLoan,
        status: "Dikembalikan"
      };
      const transformed = transformLoan(returnedLoan);
      expect(transformed.isOverdue).toBe(false);
      expect(transformed.statusClass).toBe("status status-green");
    });
  });
});
