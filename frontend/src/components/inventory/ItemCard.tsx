"use client";

import React from "react";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Item, User } from "@/types";
import { getItemImage } from "@/utils/itemImage";
import { getDepartmentIcon, departmentColor } from "@/utils/departmentStyles";

interface ItemCardProps {
  item: Item;
  currentUser: User | null;
  onBorrow: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export function ItemCard({
  item,
  currentUser,
  onBorrow,
  onEdit,
  onDelete
}: ItemCardProps) {
  const Icon = getDepartmentIcon(item.department_name);
  const isMyDepartmentItem = currentUser?.role === "admin_departemen" && currentUser.department_id === item.department_id;
  const isAdminOtherDept = currentUser?.role === "admin_departemen" && currentUser.department_id !== item.department_id;
  const imgUrl = getItemImage(item);

  return (
    <div className="item-card" style={isMyDepartmentItem ? { borderColor: "var(--olive)" } : {}}>
      <div className="item-card-media">
        <span className="item-dept-chip">{item.department_name}</span>
        {imgUrl ? (
          <img src={imgUrl} alt={item.name} className="item-card-img" />
        ) : (
          <div className={`item-card-placeholder ${departmentColor[item.department_name] || "blue"}`}>
            <Icon size={30} />
          </div>
        )}
        <span className={`availability ${item.available_stock > 0 ? "available" : "unavailable"}`}>
          <i />
          {item.available_stock > 0 ? "Tersedia" : "Habis"}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span className="dashed-pill">{item.category}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-secondary)" }}>
          {item.available_stock} / {item.total_stock} unit
        </span>
      </div>

      <h3>{item.name}</h3>
      <p>{item.description || item.category}</p>

      <div className="stock-track" style={{ marginBottom: 14 }}>
        <div style={{ width: `${item.total_stock ? (item.available_stock / item.total_stock) * 100 : 0}%` }} />
      </div>

      {isMyDepartmentItem ? (
        <div className="item-manager-actions">
          <button type="button" className="btn btn-secondary btn-small" onClick={() => onEdit?.(item)}>
            <Pencil size={14} /> Edit
          </button>
          <button type="button" className="icon-btn action-red" onClick={() => onDelete?.(item)} title="Hapus Barang">
            <Trash2 size={15} />
          </button>
        </div>
      ) : isAdminOtherDept ? (
        <div style={{ textAlign: "center", padding: "6px 0", fontSize: 11, color: "var(--ink-muted)", fontStyle: "italic" }}>
          Dikelola oleh Departemen {item.department_name}
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-accent btn-full"
          disabled={item.available_stock === 0}
          onClick={() => onBorrow(item)}
        >
          {item.available_stock > 0 ? "Ajukan Peminjaman" : "Stok Habis"} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
