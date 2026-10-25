import { describe, it, expect } from "vitest";
import { statusClass, isActiveLoan, isPendingLoan } from "@/utils/loans";
import { Loan } from "@/types";

describe("loans utils", () => {
  it("returns correct CSS class for each LoanStatus", () => {
    expect(statusClass("Disetujui")).toBe("status status-green");
    expect(statusClass("Dikembalikan")).toBe("status status-green");
    expect(statusClass("Ditolak")).toBe("status status-red");
    expect(statusClass("Menunggu Konfirmasi Pengembalian")).toBe("status status-blue");
    expect(statusClass("Menunggu Approval")).toBe("status status-amber");
    expect(statusClass("Other")).toBe("status status-amber");
  });

  it("determines active loans accurately", () => {
    const loanApproved = { status: "Disetujui" } as Loan;
    const loanReturnPending = { status: "Menunggu Konfirmasi Pengembalian" } as Loan;
    const loanRejected = { status: "Ditolak" } as Loan;
    const loanWaiting = { status: "Menunggu Approval" } as Loan;

    expect(isActiveLoan(loanApproved)).toBe(true);
    expect(isActiveLoan(loanReturnPending)).toBe(true);
    expect(isActiveLoan(loanRejected)).toBe(false);
    expect(isActiveLoan(loanWaiting)).toBe(false);
  });

  it("determines pending approval loans accurately", () => {
    const loanWaiting = { status: "Menunggu Approval" } as Loan;
    const loanApproved = { status: "Disetujui" } as Loan;

    expect(isPendingLoan(loanWaiting)).toBe(true);
    expect(isPendingLoan(loanApproved)).toBe(false);
  });
});
