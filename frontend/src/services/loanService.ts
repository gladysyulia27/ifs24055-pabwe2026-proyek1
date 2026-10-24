import { Loan, LoanAction, LoanPayload, TransformedLoan, ValidationResult } from "@/types";
import { loansApi } from "./api";
import { statusClass } from "@/utils/loans";

/**
 * Validates a loan request payload.
 */
export function validateLoanPayload(payload: LoanPayload): ValidationResult {
  if (!payload.inventory_id || payload.inventory_id <= 0) {
    return { isValid: false, error: "Pilih barang yang ingin dipinjam terlebih dahulu." };
  }

  if (!payload.borrower_name || payload.borrower_name.trim().length === 0) {
    return { isValid: false, error: "Nama lengkap peminjam wajib diisi." };
  }

  if (!payload.borrower_id || payload.borrower_id.trim().length === 0) {
    return { isValid: false, error: "NIM / Nomor Identitas peminjam wajib diisi." };
  }

  if (!payload.purpose || payload.purpose.trim().length === 0) {
    return { isValid: false, error: "Tujuan peminjaman barang harus dijelaskan." };
  }

  const quantity = Number(payload.quantity);
  if (isNaN(quantity) || quantity <= 0) {
    return { isValid: false, error: "Jumlah barang yang dipinjam minimal 1 unit." };
  }

  if (!payload.start_date || !payload.due_date) {
    return { isValid: false, error: "Tanggal mulai dan batas pengembalian wajib ditentukan." };
  }

  if (new Date(payload.start_date) > new Date(payload.due_date)) {
    return { isValid: false, error: "Tanggal batas pengembalian tidak boleh sebelum tanggal mulai peminjaman." };
  }

  return { isValid: true, error: null };
}

/**
 * Validates return proof submission payload.
 */
export function validateReturnProofPayload(returnProofUrl: string): ValidationResult {
  if (!returnProofUrl || returnProofUrl.trim().length === 0) {
    return { isValid: false, error: "Bukti dokumentasi foto fisik pengembalian barang wajib disertakan." };
  }

  return { isValid: true, error: null };
}

/**
 * Transforms a raw API loan entity with formatted dates, overdue calculations, and CSS classes.
 */
export function transformLoan(loan: Loan): TransformedLoan {
  const isReturned = loan.status === "Dikembalikan";
  const isRejected = loan.status === "Ditolak";

  const now = new Date();
  const dueDate = new Date(loan.due_date);
  // Set to end of due date day
  dueDate.setHours(23, 59, 59, 999);

  const isOverdue = !isReturned && !isRejected && now > dueDate;
  const loanStatusClass = statusClass(loan.status);

  return {
    ...loan,
    isOverdue,
    formattedStartDate: loan.start_date,
    formattedDueDate: loan.due_date,
    statusClass: loanStatusClass
  };
}

/**
 * Transforms a list of loans.
 */
export function transformLoanList(loans: Loan[]): TransformedLoan[] {
  return loans.map(transformLoan);
}

/**
 * Loan Service Layer isolating loan business rules, validation, and transformation.
 */
export const loanService = {
  /**
   * Fetches loans with optional status and department filters, transformed for display.
   */
  async getAll(status?: string, departmentId?: number): Promise<TransformedLoan[]> {
    const rawLoans = await loansApi.getAll(status, departmentId);
    return transformLoanList(rawLoans);
  },

  /**
   * Fetches calendar loans for the given month.
   */
  async getCalendar(month?: string): Promise<TransformedLoan[]> {
    const rawCalendar = await loansApi.getCalendar(month);
    return transformLoanList(rawCalendar);
  },

  /**
   * Submits a loan application after client-side validation.
   */
  async create(payload: LoanPayload): Promise<TransformedLoan> {
    const validation = validateLoanPayload(payload);
    if (!validation.isValid) {
      throw new Error(validation.error || "Validasi data peminjaman gagal.");
    }

    const created = await loansApi.create(payload);
    return transformLoan(created);
  },

  /**
   * Approves, rejects, or confirms loan return.
   */
  async executeAction(id: number, action: LoanAction, approvedBy?: string): Promise<TransformedLoan> {
    if (!id || id <= 0) {
      throw new Error("ID transaksi peminjaman tidak valid.");
    }

    const updated = await loansApi.action(id, action, approvedBy);
    return transformLoan(updated);
  },

  /**
   * Submits return photo proof and optional condition note.
   */
  async submitReturn(id: number, returnProofUrl: string, returnNote = ""): Promise<TransformedLoan> {
    const validation = validateReturnProofPayload(returnProofUrl);
    if (!validation.isValid) {
      throw new Error(validation.error || "Validasi bukti pengembalian gagal.");
    }

    const updated = await loansApi.submitReturn(id, returnProofUrl, returnNote);
    return transformLoan(updated);
  }
};
