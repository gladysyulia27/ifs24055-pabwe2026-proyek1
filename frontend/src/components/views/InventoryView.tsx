"use client";

import React, { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Department, Item, User } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ItemCardSkeleton } from "@/components/common/LoadingSkeleton";
import { ItemCard } from "@/components/inventory/ItemCard";
import { filterItems } from "@/utils/inventory";
import { isDepartmentAdmin } from "@/utils/roles";

const ITEM_SKELETON_COUNT = 3;

interface InventoryViewProps {
  user: User;
  departments: Department[];
  items: Item[];
  loading: boolean;
  departmentFilter: string;
  onDepartmentFilterChange: (department: string) => void;
  onBack: () => void;
  onBorrow: (item: Item) => void;
  onAddItem: () => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (item: Item) => void;
}

export function InventoryView({
  user,
  departments,
  items,
  loading,
  departmentFilter,
  onDepartmentFilterChange,
  onBack,
  onBorrow,
  onAddItem,
  onEditItem,
  onDeleteItem
}: InventoryViewProps) {
  const [search, setSearch] = useState("");
  const visibleItems = useMemo(
    () => filterItems(items, departmentFilter, search),
    [items, departmentFilter, search]
  );

  return (
    <>
      <PageHeader
        eyebrow="KATALOG BARANG"
        title="Inventori Departemen"
        description="Temukan barang inventori dan ajukan peminjaman sesuai kebutuhan kegiatan."
        onBack={onBack}
        actions={
          isDepartmentAdmin(user) && (
            <button type="button" className="btn btn-accent" onClick={onAddItem}>
              <Plus size={16} /> Tambah Inventori {user.department_name}
            </button>
          )
        }
      />

      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama barang, kategori..."
          />
        </div>
        <div className="filter-dept-wrap">
          <select value={departmentFilter} onChange={(e) => onDepartmentFilterChange(e.target.value)}>
            <option>Semua Departemen</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-count">{visibleItems.length} barang</div>
      </div>

      {loading ? (
        <div className="items-grid">
          {Array.from({ length: ITEM_SKELETON_COUNT }, (_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleItems.length === 0 ? (
        <EmptyState message="Tidak ada barang yang cocok dengan kriteria pencarian." />
      ) : (
        <div className="items-grid">
          {visibleItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              currentUser={user}
              onBorrow={onBorrow}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      )}
    </>
  );
}
