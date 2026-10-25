import { Loan, LoanStatus } from "@/types";

export function statusClass(status: LoanStatus | string): string {
  if (status === "Disetujui" || status === "Dikembalikan") return "status status-green";
  if (status === "Ditolak") return "status status-red";
  if (status === "Menunggu Konfirmasi Pengembalian") return "status status-blue";
  return "status status-amber";
}

export const isActiveLoan = (loan: Loan): boolean =>
  loan.status === "Disetujui" || loan.status === "Menunggu Konfirmasi Pengembalian";

export const isPendingLoan = (loan: Loan): boolean => loan.status === "Menunggu Approval";
