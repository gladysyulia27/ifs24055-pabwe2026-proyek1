"use client";

import React from "react";
import { ArrowDownToLine, Check, ImageIcon, X } from "lucide-react";
import { Loan, LoanAction, User } from "@/types";
import { ItemThumb } from "@/components/inventory/ItemThumb";
import { isDepartmentAdmin, isStudent } from "@/utils/roles";
import { statusClass } from "@/utils/loans";

interface LoanRowProps {
  loan: Loan;
  currentUser: User | null;
  onAction?: (loan: Loan, action: LoanAction) => void;
  onOpenReturn?: (loan: Loan) => void;
}

function AdminActions({ loan, currentUser, onAction }: Pick<LoanRowProps, "loan" | "currentUser" | "onAction">) {
  const isOwnDepartment =
    !currentUser?.department_name ||
    !loan.department_name ||
    currentUser.department_name.toUpperCase() === loan.department_name.toUpperCase();

  if (!isOwnDepartment) {
    return <span className="loan-note-muted">Departemen {loan.department_name}</span>;
  }

  if (loan.status === "Menunggu Approval") {
    return (
      <>
        <button
          type="button"
          className="btn btn-primary btn-small"
          onClick={() => onAction?.(loan, "approve")}
          title="Setujui Peminjaman"
        >
          <Check size={14} /> Setujui
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-small action-red"
          onClick={() => onAction?.(loan, "reject")}
          title="Tolak Peminjaman"
        >
          <X size={14} /> Tolak
        </button>
      </>
    );
  }

  if (loan.status === "Menunggu Konfirmasi Pengembalian") {
    return (
      <>
        {loan.return_proof_url && (
          <a
            href={loan.return_proof_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-small"
            title="Buka Bukti Foto"
          >
            <ImageIcon size={14} /> Bukti Foto
          </a>
        )}
        <button
          type="button"
          className="btn btn-accent btn-small"
          onClick={() => onAction?.(loan, "confirm-return")}
          title="Konfirmasi Pengembalian Barang"
        >
          <Check size={14} /> Konfirmasi Kembali
        </button>
      </>
    );
  }

  return null;
}

function StudentActions({ loan, currentUser, onOpenReturn }: Pick<LoanRowProps, "loan" | "currentUser" | "onOpenReturn">) {
  const isBorrower =
    !currentUser?.identifier ||
    !loan.borrower_id ||
    currentUser.identifier === loan.borrower_id;

  if (!isBorrower) {
    return null;
  }

  if (loan.status === "Disetujui") {
    return (
      <button
        type="button"
        className="btn btn-secondary btn-small"
        onClick={() => onOpenReturn?.(loan)}
        title="Ajukan Pengembalian Barang"
      >
        <ArrowDownToLine size={14} /> Kembalikan Barang
      </button>
    );
  }

  if (loan.status === "Menunggu Konfirmasi Pengembalian") {
    return <span className="loan-note">Menunggu verifikasi pengelola</span>;
  }

  return null;
}

function StatusNote({ status }: { status: Loan["status"] }) {
  if (status === "Dikembalikan") return <span className="loan-note-done">Selesai</span>;
  if (status === "Ditolak") return <span className="loan-note-muted">Ditolak</span>;
  return null;
}

export function LoanRow({ loan, currentUser, onAction, onOpenReturn }: LoanRowProps) {
  return (
    <tr>
      <td>
        <div className="table-item-cell">
          <ItemThumb source={loan.inventory_name} alt={loan.inventory_name} />
          <div>
            <b>{loan.inventory_name}</b>
            <span className="table-sub">{loan.department_name}</span>
          </div>
        </div>
      </td>
      <td>
        <b>{loan.borrower_name}</b>
        <span className="table-sub">
          {loan.borrower_id} · {loan.organization}
        </span>
      </td>
      <td>
        <b>{loan.quantity} unit</b>
        <span className="table-sub">
          {loan.start_date} s/d {loan.due_date}
        </span>
      </td>
      <td>
        <span className={statusClass(loan.status)}>{loan.status}</span>
      </td>
      <td>
        <div className="row-actions">
          {isDepartmentAdmin(currentUser) && (
            <AdminActions loan={loan} currentUser={currentUser} onAction={onAction} />
          )}
          {isStudent(currentUser) && (
            <StudentActions loan={loan} currentUser={currentUser} onOpenReturn={onOpenReturn} />
          )}
          <StatusNote status={loan.status} />
        </div>
      </td>
    </tr>
  );
}
