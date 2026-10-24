import React from "react";
import { Plus } from "lucide-react";
import { User } from "@/types";

interface DepartmentAdminBannerProps {
  user: User;
  onAddItem: () => void;
}

export function DepartmentAdminBanner({ user, onAddItem }: DepartmentAdminBannerProps) {
  return (
    <div className="dept-admin-banner">
      <div className="dept-admin-banner-left">
        <div className="dept-admin-badge">PENGELOLA INVENTORI</div>
        <div>
          <h3>Departemen {user.department_name}</h3>
          <p>Anda memiliki hak akses untuk menambah, memperbarui stok, serta menyetujui peminjaman barang departemen ini.</p>
        </div>
      </div>
      <button type="button" className="btn btn-accent btn-small" onClick={onAddItem}>
        <Plus size={15} /> Tambah Inventori {user.department_name}
      </button>
    </div>
  );
}
