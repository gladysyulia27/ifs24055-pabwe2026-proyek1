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

    it("does not flag overdue for rejected items or future due dates", () => {
      const rejectedLoan: Loan = {
        ...mockLoan,
        status: "Ditolak"
      };
      expect(transformLoan(rejectedLoan).isOverdue).toBe(false);

      const futureLoan: Loan = {
        ...mockLoan,
        due_date: "2099-12-31"
      };
      expect(transformLoan(futureLoan).isOverdue).toBe(false);
    });

    it("transforms list of loans with transformLoanList", async () => {
      const { transformLoanList } = await import("@/services/loanService");
      const list = transformLoanList([mockLoan]);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(5);
    });
  });

  describe("loanService CRUD API methods", () => {
    const mockLoan: Loan = {
      id: 5,
      inventory_id: 1,
      inventory_name: "Mic",
      borrower_name: "Gladys",
      quantity: 1,
      start_date: "2026-10-25",
      due_date: "2026-10-26",
      status: "Disetujui"
    } as Loan;

    it("getAll fetches and returns transformed loans", async () => {
      const { loansApi } = await import("@/services/api");
      vi.spyOn(loansApi, "getAll").mockResolvedValue([mockLoan]);

      const { loanService } = await import("@/services/loanService");
      const list = await loanService.getAll("Disetujui", 1);
      expect(list).toHaveLength(1);
    });

    it("getAll handles API error", async () => {
      const { loansApi } = await import("@/services/api");
      vi.spyOn(loansApi, "getAll").mockRejectedValue(new Error("Network failed"));

      const { loanService } = await import("@/services/loanService");
      await expect(loanService.getAll()).rejects.toThrowError();
    });

    it("getCalendar fetches and returns calendar loans", async () => {
      const { loansApi } = await import("@/services/api");
      vi.spyOn(loansApi, "getCalendar").mockResolvedValue([mockLoan]);

      const { loanService } = await import("@/services/loanService");
      const list = await loanService.getCalendar("2026-10");
      expect(list).toHaveLength(1);
    });

    it("getCalendar handles API error", async () => {
      const { loansApi } = await import("@/services/api");
      vi.spyOn(loansApi, "getCalendar").mockRejectedValue(new Error("Network failed"));

      const { loanService } = await import("@/services/loanService");
      await expect(loanService.getCalendar()).rejects.toThrowError();
    });

    it("create submits loan request and validates payload", async () => {
      const { loansApi } = await import("@/services/api");
      vi.spyOn(loansApi, "create").mockResolvedValue(mockLoan);

      const { loanService } = await import("@/services/loanService");
      const created = await loanService.create({
        inventory_id: 1,
        borrower_name: "Gladys",
        purpose: "Rapat",
        quantity: 1,
        start_date: "2026-10-25",
        due_date: "2026-10-26"
      } as LoanPayload);
      expect(created.id).toBe(5);

      await expect(
        loanService.create({
          inventory_id: 0,
          purpose: "Rapat",
          quantity: 1,
          start_date: "2026-10-25",
          due_date: "2026-10-26"
        } as LoanPayload)
      ).rejects.toThrowError();
    });

    it("executeAction processes action and validates ID", async () => {
      const { loansApi } = await import("@/services/api");
      vi.spyOn(loansApi, "action").mockResolvedValue(mockLoan);

      const { loanService } = await import("@/services/loanService");
      const updated = await loanService.executeAction(5, "approve", "Admin");
      expect(updated.id).toBe(5);

      await expect(
        loanService.executeAction(0, "approve")
      ).rejects.toThrowError();
    });

    it("submitReturn submits proof and validates URL", async () => {
      const { loansApi } = await import("@/services/api");
      vi.spyOn(loansApi, "submitReturn").mockResolvedValue(mockLoan);

      const { loanService } = await import("@/services/loanService");
      const res = await loanService.submitReturn(5, "data:image/png;base64,proof", "Catatan");
      expect(res.id).toBe(5);

      await expect(
        loanService.submitReturn(5, "")
      ).rejects.toThrowError();
    });

    it("handles API rejection across create, executeAction, and submitReturn", async () => {
      const { loansApi } = await import("@/services/api");
      const { loanService } = await import("@/services/loanService");

      vi.spyOn(loansApi, "create").mockRejectedValue(new Error("API create error"));
      await expect(
        loanService.create({
          inventory_id: 1,
          quantity: 1,
          start_date: "2026-10-25",
          due_date: "2026-10-26"
        } as LoanPayload)
      ).rejects.toThrowError();

      vi.spyOn(loansApi, "action").mockRejectedValue(new Error("API action error"));
      await expect(loanService.executeAction(5, "approve")).rejects.toThrowError();

      vi.spyOn(loansApi, "submitReturn").mockRejectedValue(new Error("API submitReturn error"));
      await expect(
        loanService.submitReturn(5, "data:image/png;base64,proof")
      ).rejects.toThrowError();
    });
  });
});
