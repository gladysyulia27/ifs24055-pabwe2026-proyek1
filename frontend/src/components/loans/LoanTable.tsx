"use client";

import React from "react";
import { Check, X, ArrowDownToLine, ImageIcon, Package } from "lucide-react";
import { Loan, User } from "@/types";
import { getItemImage } from "@/utils/itemImage";
import { TableRowSkeleton } from "@/components/common/LoadingSkeleton";

interface LoanTableProps {
  loans: Loan[];
  currentUser: User | null;
  loading?: boolean;
  onAction?: (loan: Loan, action: "approve" | "reject" | "confirm-return") => void;
  onOpenReturn?: (loan: Loan) => void;
}

export function statusClass(s: string): string {
  if (s === "Disetujui" || s === "Dikembalikan") return "status status-green";
  if (s === "Ditolak") return "status status-red";
  if (s === "Menunggu Konfirmasi Pengembalian") return "status status-blue";
  return "status status-amber";
}

export function LoanTable({
  loans,
  currentUser,
  loading = false,
  onAction,
  onOpenReturn
}: LoanTableProps) {
  if (loading) {
    return (
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Barang</th>
              <th>Peminjam</th>
              <th>Jadwal & Unit</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </tbody>
        </table>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="empty-state">
        <div>
          <Package size={22} />
        </div>
        <span>Belum ada transaksi peminjaman barang tercatat.</span>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Barang</th>
            <th>Peminjam</th>
            <th>Jadwal & Unit</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => {
            const img = getItemImage(l.inventory_name);
            return (
              <tr key={l.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {img ? (
                      <img src={img} alt={l.inventory_name} className="item-thumb-img" />
                    ) : (
                      <div className="mini-item">
                        <Package size={15} />
                      </div>
                    )}
                    <div>
                      <b>{l.inventory_name}</b>
                      <span className="table-sub">{l.department_name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <b>{l.borrower_name}</b>
                  <span className="table-sub">{l.borrower_id} · {l.organization}</span>
                </td>
                <td>
                  <b>{l.quantity} unit</b>
                  <span className="table-sub">{l.start_date} s/d {l.due_date}</span>
                </td>
                <td>
                  <span className={statusClass(l.status)}>{l.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    {/* Admin Department Actions */}
                    {currentUser?.role === "admin_departemen" && l.status === "Menunggu Approval" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-small"
                          onClick={() => onAction?.(l, "approve")}
                          title="Setujui Peminjaman"
                        >
                          <Check size={14} /> Setujui
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-small action-red"
                          onClick={() => onAction?.(l, "reject")}
                          title="Tolak Peminjaman"
                        >
                          <X size={14} /> Tolak
                        </button>
                      </>
                    )}

                    {currentUser?.role === "admin_departemen" && l.status === "Menunggu Konfirmasi Pengembalian" && (
                      <>
                        {l.return_proof_url && (
                          <a
                            href={l.return_proof_url}
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
                          onClick={() => onAction?.(l, "confirm-return")}
                          title="Konfirmasi Pengembalian Barang"
                        >
                          <Check size={14} /> Konfirmasi Kembali
                        </button>
                      </>
                    )}

                    {/* Mahasiswa Actions */}
                    {currentUser?.role === "mahasiswa" && l.status === "Disetujui" && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        onClick={() => onOpenReturn?.(l)}
                        title="Ajukan Pengembalian Barang"
                      >
                        <ArrowDownToLine size={14} /> Kembalikan Barang
                      </button>
                    )}

                    {currentUser?.role === "mahasiswa" && l.status === "Menunggu Konfirmasi Pengembalian" && (
                      <span style={{ fontSize: 11.5, color: "var(--ink-secondary)", fontStyle: "italic" }}>
                        Menunggu verifikasi pengelola
                      </span>
                    )}

                    {l.status === "Dikembalikan" && (
                      <span style={{ fontSize: 11.5, color: "var(--olive)", fontWeight: 700 }}>
                        Selesai
                      </span>
                    )}

                    {l.status === "Ditolak" && (
                      <span style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
                        Ditolak
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
