import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: string;
  color: string;
}

export function StatCard({ icon, label, value, sub, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className={`stat-circle-icon ${color}`}>{icon}</div>
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub">{sub}</div>
      </div>
    </div>
  );
}
