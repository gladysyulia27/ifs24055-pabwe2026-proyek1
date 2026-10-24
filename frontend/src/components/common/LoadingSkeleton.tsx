/**
 * LoadingSkeleton — Reusable animated placeholder components shown while
 * data is being fetched. Each variant mirrors the shape of its real counterpart
 * (stat card, item card, table row) so layout does not shift on load.
 *
 * CSS custom properties consumed by `.skeleton-box` in globals.css:
 *   --sk-w  → width
 *   --sk-h  → height
 *   --sk-r  → border-radius
 */
"use client";

import React from "react";

export function SkeletonBox({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  className = "",
  style
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cssVars = {
    "--sk-w": typeof width === "number" ? `${width}px` : width,
    "--sk-h": typeof height === "number" ? `${height}px` : height,
    "--sk-r": borderRadius,
    ...style
  } as React.CSSProperties;

  return <div className={`skeleton-box ${className}`} style={cssVars} />;
}


export function StatSkeleton() {
  return (
    <div className="stat-card skeleton-stat-card">
      <div className="stat-header">
        <SkeletonBox width="60%" height={16} />
        <SkeletonBox width={36} height={36} borderRadius="50%" />
      </div>
      <div>
        <SkeletonBox width="40%" height={38} className="skeleton-stat-val" />
        <SkeletonBox width="70%" height={14} />
      </div>
    </div>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="item-card skeleton-item-card">
      <div className="item-card-media skeleton-item-media">
        <SkeletonBox width="100%" height="100%" borderRadius="16px" />
      </div>
      <div className="skeleton-item-header">
        <SkeletonBox width={80} height={20} borderRadius="12px" />
        <SkeletonBox width={60} height={16} />
      </div>
      <SkeletonBox width="85%" height={22} className="skeleton-item-title" />
      <SkeletonBox width="60%" height={16} className="skeleton-item-sub" />
      <SkeletonBox width="100%" height={38} borderRadius="20px" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td>
        <SkeletonBox width={120} height={18} />
        <SkeletonBox width={80} height={13} className="skeleton-table-sub" />
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
