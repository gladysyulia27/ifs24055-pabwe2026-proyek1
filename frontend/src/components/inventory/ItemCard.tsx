"use client";

import React from "react";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Item, User } from "@/types";
import { getItemImage } from "@/utils/itemImage";
import { getDepartmentColor, getDepartmentIcon } from "@/utils/departmentStyles";
import { isDepartmentAdmin } from "@/utils/roles";

interface ItemCardProps {
  item: Item;
  currentUser: User | null;
  onBorrow: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

function ItemCardActions({ item, currentUser, onBorrow, onEdit, onDelete }: ItemCardProps) {
  if (isDepartmentAdmin(currentUser)) {
    if (currentUser?.department_id !== item.department_id) {
      return <div className="item-card-foreign-note">Dikelola oleh Departemen {item.department_name}</div>;
    }
    return (
      <div className="item-manager-actions">
        <button type="button" className="btn btn-secondary btn-small" onClick={() => onEdit?.(item)}>
          <Pencil size={14} /> Edit
        </button>
        <button type="button" className="icon-btn action-red" onClick={() => onDelete?.(item)} title="Hapus Barang">
          <Trash2 size={15} />
        </button>
      </div>
    );
  }

  const inStock = item.available_stock > 0;
  return (
    <button type="button" className="btn btn-accent btn-full" disabled={!inStock} onClick={() => onBorrow(item)}>
      {inStock ? "Ajukan Peminjaman" : "Stok Habis"} <ArrowRight size={15} />
    </button>
  );
}

export function ItemCard(props: ItemCardProps) {
  const { item, currentUser } = props;
  const DepartmentIcon = getDepartmentIcon(item.department_name);
  const isOwnDepartment = isDepartmentAdmin(currentUser) && currentUser?.department_id === item.department_id;
  const imageUrl = getItemImage(item);
  const inStock = item.available_stock > 0;
  const stockPercent = item.total_stock ? (item.available_stock / item.total_stock) * 100 : 0;

  return (
    <div className={`item-card ${isOwnDepartment ? "item-card-owned" : ""}`}>
      <div className="item-card-media">
        <span className="item-dept-chip">{item.department_name}</span>
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="item-card-img" />
        ) : (
          <div className={`item-card-placeholder ${getDepartmentColor(item.department_name)}`}>
            <DepartmentIcon size={30} />
          </div>
        )}
        <span className={`availability ${inStock ? "available" : "unavailable"}`}>
          <i />
          {inStock ? "Tersedia" : "Habis"}
        </span>
      </div>

      <div className="item-card-meta">
        <span className="dashed-pill">{item.category}</span>
        <span className="item-card-stock">
          {item.available_stock} / {item.total_stock} unit
        </span>
      </div>

      <h3>{item.name}</h3>
      <p>{item.description || item.category}</p>

      <div className="stock-track item-card-track">
        <div style={{ width: `${stockPercent}%` }} />
      </div>

      <ItemCardActions {...props} />
    </div>
  );
}
