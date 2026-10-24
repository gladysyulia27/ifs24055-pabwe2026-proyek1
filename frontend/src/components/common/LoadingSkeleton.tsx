"use client";

import React from "react";

export function SkeletonBox({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  style
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, rgba(235, 230, 220, 0.6) 0%, rgba(245, 242, 235, 0.9) 50%, rgba(235, 230, 220, 0.6) 100%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.5s infinite",
        ...style
      }}
    />
  );
}

export function StatSkeleton() {
  return (
    <div className="stat-card" style={{ opacity: 0.8 }}>
      <div className="stat-header">
        <SkeletonBox width="60%" height={16} />
        <SkeletonBox width={36} height={36} borderRadius="50%" />
      </div>
      <div>
        <SkeletonBox width="40%" height={38} style={{ margin: "8px 0" }} />
        <SkeletonBox width="70%" height={14} />
      </div>
    </div>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="item-card" style={{ opacity: 0.8 }}>
      <div className="item-card-media" style={{ background: "rgba(0,0,0,0.03)" }}>
        <SkeletonBox width="100%" height="100%" borderRadius="16px" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "12px 0 6px" }}>
        <SkeletonBox width={80} height={20} borderRadius="12px" />
        <SkeletonBox width={60} height={16} />
      </div>
      <SkeletonBox width="85%" height={22} style={{ marginBottom: 8 }} />
      <SkeletonBox width="60%" height={16} style={{ marginBottom: 16 }} />
      <SkeletonBox width="100%" height={38} borderRadius="20px" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td>
        <SkeletonBox width={120} height={18} />
        <SkeletonBox width={80} height={13} style={{ marginTop: 4 }} />
      </td>
      <td>
        <SkeletonBox width={100} height={16} />
      </td>
      <td>
        <SkeletonBox width={140} height={16} />
      </td>
      <td>
        <SkeletonBox width={80} height={24} borderRadius="12px" />
      </td>
      <td>
        <SkeletonBox width={90} height={32} borderRadius="16px" />
      </td>
    </tr>
  );
}
