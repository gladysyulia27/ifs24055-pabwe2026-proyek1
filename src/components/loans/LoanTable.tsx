"use client";

import React from "react";
import { Loan, LoanAction, User } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";
import { TableRowSkeleton } from "@/components/common/LoadingSkeleton";
import { LoanRow } from "@/components/loans/LoanRow";

const COLUMNS = ["Barang", "Peminjam", "Jadwal & Unit", "Status", "Aksi"];

interface LoanTableProps {
  loans: Loan[];
  currentUser: User | null;
  loading?: boolean;
  onAction?: (loan: Loan, action: LoanAction) => void;
  onOpenReturn?: (loan: Loan) => void;
}

export function LoanTable({ loans, currentUser, loading = false, onAction, onOpenReturn }: LoanTableProps) {
  if (!loading && loans.length === 0) {
    return <EmptyState message="Belum ada transaksi peminjaman barang tercatat." />;
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? [0, 1, 2].map((i) => <TableRowSkeleton key={i} />)
            : loans.map((loan) => (
                <LoanRow
                  key={loan.id}
                  loan={loan}
                  currentUser={currentUser}
                  onAction={onAction}
                  onOpenReturn={onOpenReturn}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
}
