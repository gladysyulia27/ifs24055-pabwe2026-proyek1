"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Department, Item, User } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { getDepartmentColor, getDepartmentIcon } from "@/utils/departmentStyles";
import { sumTotalStock } from "@/utils/inventory";
import { isDepartmentAdmin } from "@/utils/roles";

const SAMPLE_ITEMS_LIMIT = 4;

interface DepartmentCardProps {
  department: Department;
  items: Item[];
  isOwnDepartment: boolean;
  onViewInventory: () => void;
}

function DepartmentCard({ department, items, isOwnDepartment, onViewInventory }: DepartmentCardProps) {
  const Icon = getDepartmentIcon(department.name);
  const hiddenCount = items.length - SAMPLE_ITEMS_LIMIT;

  return (
    <div className={`panel dept-card ${isOwnDepartment ? "dept-card-owned" : ""}`}>
      <div className={`dept-badge dept-badge-lg ${getDepartmentColor(department.name)}`}>
        <Icon size={22} />
      </div>
      <h2>
        {department.name}{" "}
        {isOwnDepartment && <span className="dept-card-owned-label"> (Dikelola Anda)</span>}
      </h2>
      <p>
        {items.length} jenis barang · {sumTotalStock(items)} unit total
      </p>
      <div className="dept-sample">
        {items.slice(0, SAMPLE_ITEMS_LIMIT).map((item) => (
          <span key={item.id}>{item.name}</span>
        ))}
        {hiddenCount > 0 && <span>+{hiddenCount} lainnya</span>}
      </div>
      <div className="contact-block">
        <b>Penanggung jawab</b>
        <span>{department.contact_name || "Belum diatur"}</span>
        <span>{department.contact_email || "Email belum diatur"}</span>
        {department.contact_phone && <span>{department.contact_phone}</span>}
      </div>
      <button type="button" className="btn btn-secondary btn-full dept-card-action" onClick={onViewInventory}>
        Lihat inventori <ArrowRight size={15} />
      </button>
    </div>
  );
}

interface DepartmentsViewProps {
  user: User;
  departments: Department[];
  items: Item[];
  onBack: () => void;
  onSelectDepartment: (departmentName: string) => void;
}

export function DepartmentsView({ user, departments, items, onBack, onSelectDepartment }: DepartmentsViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="STRUKTUR INVENTORI"
        title="Departemen BEM IT Del"
        description="Setiap barang dimiliki dan dikelola oleh departemen masing-masing."
        onBack={onBack}
      />

      <div className="dept-cards">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            items={items.filter((i) => i.department_id === department.id)}
            isOwnDepartment={isDepartmentAdmin(user) && user.department_id === department.id}
            onViewInventory={() => onSelectDepartment(department.name)}
          />
        ))}
      </div>
    </>
  );
}
