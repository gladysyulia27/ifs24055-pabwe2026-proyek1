"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Loan, LoanAction, User } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { LoanTable } from "@/components/loans/LoanTable";
import { isDepartmentAdmin } from "@/utils/roles";

interface LoansViewProps {
  user: User;
  loans: Loan[];
  loading: boolean;
  onBack: () => void;
  onOpenCalendar: () => void;
  onAction: (loan: Loan, action: LoanAction) => void;
  onOpenReturn: (loan: Loan) => void;
}

export function LoansView({ user, loans, loading, onBack, onOpenCalendar, onAction, onOpenReturn }: LoansViewProps) {
  const isAdmin = isDepartmentAdmin(user);

  return (
    <>
      <PageHeader
        eyebrow={isAdmin ? "PANEL PERSETUJUAN" : "STATUS PEMINJAMAN"}
        title={isAdmin ? `Persetujuan Peminjaman Departemen ${user.department_name}` : "Peminjaman Saya"}
        description={
          isAdmin
            ? "Kelola dan verifikasi permohonan peminjaman inventori departemen Anda."
            : "Pantau riwayat permohonan peminjaman serta status persetujuan dari pengelola."
        }
        onBack={onBack}
        actions={
          <button type="button" className="btn btn-secondary" onClick={onOpenCalendar}>
            Lihat di kalender <ArrowRight size={15} />
          </button>
        }
      />

      <LoanTable
        loans={loans}
        currentUser={user}
        loading={loading}
        onAction={onAction}
        onOpenReturn={onOpenReturn}
      />
    </>
  );
}
