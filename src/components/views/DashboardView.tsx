"use client";

import React from "react";
import { ArrowRight, ArrowDownToLine, CheckCircle2, Clock3, Package } from "lucide-react";
import { Department, Item, Loan, PageKey } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelHead } from "@/components/common/PanelHead";
import { EmptyState } from "@/components/common/EmptyState";
import { StatSkeleton } from "@/components/common/LoadingSkeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { getDepartmentColor, getDepartmentIcon } from "@/utils/departmentStyles";
import { statusClass } from "@/utils/loans";
import { DashboardComputedStats, useDashboardStats } from "@/hooks/useDashboardStats";

const RECENT_LOANS_LIMIT = 5;
const STAT_SKELETON_COUNT = 4;

interface DashboardViewProps {
  departments: Department[];
  items: Item[];
  loans: Loan[];
  loading: boolean;
  onNavigate: (page: PageKey) => void;
  onSelectDepartment: (departmentName: string) => void;
}

function LinkButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="text-btn" onClick={onClick}>
      {label} <ArrowRight size={14} />
    </button>
  );
}

function DashboardStats({
  stats,
  loading
}: {
  stats: DashboardComputedStats;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="stats-grid">
        {Array.from({ length: STAT_SKELETON_COUNT }, (_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: <Package size={20} />,
      label: "Total Inventori",
      value: stats.totalStockUnits,
      sub: `${stats.totalItems} jenis barang`,
      color: "blue"
    },
    {
      icon: <ArrowDownToLine size={20} />,
      label: "Sedang Dipinjam",
      value: stats.activeBorrowedUnits,
      sub: `${stats.activeLoansCount} transaksi aktif`,
      color: "pink"
    },
    {
      icon: <CheckCircle2 size={20} />,
      label: "Barang Tersedia",
      value: stats.availableStockUnits,
      sub: "Siap dipinjam",
      color: "green"
    },
    {
      icon: <Clock3 size={20} />,
      label: "Menunggu Approval",
      value: stats.pendingApprovalCount,
      sub: "Perlu ditinjau",
      color: "yellow"
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function DepartmentSummary({
  summaries,
  onNavigate,
  onSelectDepartment
}: {
  summaries: DashboardComputedStats["departmentSummaries"];
  onNavigate: (page: PageKey) => void;
  onSelectDepartment: (departmentName: string) => void;
}) {
  return (
    <section className="panel department-panel">
      <PanelHead
        title="Inventori per Departemen"
        subtitle="Ringkasan kepemilikan barang"
        action={<LinkButton label="Lihat semua" onClick={() => onNavigate("Departemen")} />}
      />
      <div className="dept-list">
        {summaries.map((department) => {
          const Icon = getDepartmentIcon(department.name);
          return (
            <button
              type="button"
              className="dept-row"
              key={department.id}
              onClick={() => onSelectDepartment(department.name)}
            >
              <div className={`dept-badge ${getDepartmentColor(department.name)}`}>
                <Icon size={18} />
              </div>
              <div className="dept-name">
                <b>{department.name}</b>
                <span>{department.itemCount} jenis barang</span>
              </div>
              <div className="dept-total">{department.totalUnits} unit</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RecentActivity({ loans, onNavigate }: Pick<DashboardViewProps, "loans" | "onNavigate">) {
  return (
    <section className="panel">
      <PanelHead
        title="Aktivitas Terbaru"
        subtitle="Peminjaman terkini"
        action={<LinkButton label="Semua transaksi" onClick={() => onNavigate("Peminjaman")} />}
      />
      <div className="activity-list">
        {loans.length === 0 ? (
          <EmptyState message="Belum ada transaksi peminjaman." />
        ) : (
          loans.slice(0, RECENT_LOANS_LIMIT).map((loan) => (
            <div className="activity-row" key={loan.id}>
              <div className="activity-copy">
                <b>{loan.borrower_name}</b>
                <span>
                  Meminjam {loan.quantity} unit <em>{loan.inventory_name}</em> ({loan.department_name})
                </span>
              </div>
              <span className={statusClass(loan.status)}>{loan.status}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function DashboardView({ departments, items, loans, loading, onNavigate, onSelectDepartment }: DashboardViewProps) {
  const computedStats = useDashboardStats(departments, items, loans);

  return (
    <>
      <PageHeader
        eyebrow="OVERVIEW ORGANISASI"
        title="Dashboard Inventori"
        description="Pantau ketersediaan barang dan aktivitas peminjaman BEM IT Del."
        actions={
          <button type="button" className="btn btn-accent" onClick={() => onNavigate("Inventori")}>
            <Package size={17} /> Jelajahi inventori <ArrowRight size={16} />
          </button>
        }
      />

      <DashboardStats stats={computedStats} loading={loading} />

      <div className="dashboard-grid">
        <DepartmentSummary
          summaries={computedStats.departmentSummaries}
          onNavigate={onNavigate}
          onSelectDepartment={onSelectDepartment}
        />
        <RecentActivity loans={loans} onNavigate={onNavigate} />
      </div>
    </>
  );
}
