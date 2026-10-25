"use client";

import React from "react";
import { UserCheck } from "lucide-react";
import { User } from "@/types";
import { isDepartmentAdmin } from "@/utils/roles";

interface DemoAccountsProps {
  accounts: User[];
  onSelect: (email: string) => void;
}

export function DemoAccounts({ accounts, onSelect }: DemoAccountsProps) {
  if (accounts.length === 0) return null;

  return (
    <div className="demo-accounts-box">
      <span className="demo-accounts-title">
        <UserCheck size={14} /> Akses Cepat Uji Coba (Demo):
      </span>
      <div className="demo-chips">
        {accounts.map((account) => {
          const roleLabel = isDepartmentAdmin(account) ? account.department_name : "Mahasiswa";
          return (
            <button
              type="button"
              key={account.id}
              className="demo-chip"
              onClick={() => onSelect(account.email)}
              title={`Klik untuk mengisi akun ${account.full_name} (${roleLabel})`}
            >
              <b>{roleLabel}</b>
              <span>{account.username}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
