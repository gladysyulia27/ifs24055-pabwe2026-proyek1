/**
 * ItemThumb — Compact image thumbnail for an inventory item.
 * Falls back to a Package icon placeholder when no image is available.
 * The `large` variant is used inside loan/return modals.
 */
import React from "react";
import { Package } from "lucide-react";
import { Item } from "@/types";
import { getItemImage } from "@/utils/itemImage";

interface ItemThumbProps {
  /** Item (uses its custom image first) or just an item name. */
  source: Item | string;
  alt: string;
  large?: boolean;
}

export function ItemThumb({ source, alt, large = false }: ItemThumbProps) {
  const src = getItemImage(source);
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`item-thumb-img${large ? " item-thumb-img--large" : ""}`}
      />
    );
  }
  return (
    <div className="mini-item">
      <Package size={large ? 20 : 15} />
    </div>
  );
}


interface ItemSummaryProps extends ItemThumbProps {
  title: string;
  subtitle: string;
}

/** Highlighted item header shown at the top of the loan and return modals. */
export function ItemSummary({ title, subtitle, ...thumb }: ItemSummaryProps) {
  return (
    <div className="selected-item">
      <ItemThumb {...thumb} large />
      <div>
        <b>{title}</b>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
