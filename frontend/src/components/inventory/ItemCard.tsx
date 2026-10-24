"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Item, User } from "@/types";
import { getItemImage } from "@/utils/itemImage";
import { getDepartmentColor, getDepartmentIcon } from "@/utils/departmentStyles";
import { isDepartmentAdmin } from "@/utils/roles";
import { useItemStock } from "@/hooks/useItemStock";
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  item: Item;
  currentUser: User | null;
  onBorrow: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

function ItemCardActions({ item, currentUser, onBorrow, onEdit, onDelete }: ItemCardProps) {
  const { inStock, isOwnDepartment } = useItemStock(item, currentUser);

  if (isDepartmentAdmin(currentUser)) {
    if (!isOwnDepartment) {
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

  return (
    <button type="button" className="btn btn-accent btn-full" disabled={!inStock} onClick={() => onBorrow(item)}>
      {inStock ? "Ajukan Peminjaman" : "Stok Habis"} <ArrowRight size={15} />
    </button>
  );
}

export function ItemCard(props: ItemCardProps) {
  const { item, currentUser } = props;
  const { inStock, bucket, isDanger, isWarning, isOwnDepartment } = useItemStock(item, currentUser);
  const DepartmentIcon = getDepartmentIcon(item.department_name);
  const imageUrl = getItemImage(item);
  const widthClass = (styles as Record<string, string>)[`w${bucket}`] || styles.w0;

  return (
    <div className={`item-card ${styles.card} ${isOwnDepartment ? `${styles.cardOwned} item-card-owned` : ""}`}>
      <div className={`item-card-media ${styles.media}`}>
        <span className={`item-dept-chip ${styles.deptChip}`}>{item.department_name}</span>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            width={320}
            height={200}
            className={`item-card-img ${styles.img}`}
            unoptimized={imageUrl.startsWith("data:")}
          />
        ) : (
          <div className={`item-card-placeholder ${styles.placeholder} ${getDepartmentColor(item.department_name)}`}>
            <DepartmentIcon size={30} />
          </div>
        )}
        <span className={`availability ${styles.availability} ${inStock ? "available" : "unavailable"}`}>
          <i />
          {inStock ? "Tersedia" : "Habis"}
        </span>
      </div>

      <div className={`item-card-meta ${styles.meta}`}>
        <span className="dashed-pill">{item.category}</span>
        <span className={`item-card-stock ${styles.stock}`}>
          {item.available_stock} / {item.total_stock} unit
        </span>
      </div>

      <h3 className={styles.title}>{item.name}</h3>
      <p className={styles.desc}>{item.description || item.category}</p>

      <div className={`stock-track item-card-track ${styles.track}`}>
        <div className={`${styles.fill} ${widthClass} ${isDanger ? styles.fillDanger : isWarning ? styles.fillWarning : ""}`} />
      </div>

      <ItemCardActions {...props} />
    </div>
  );
}
