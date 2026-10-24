import React from "react";
import { Package } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <div>
        <Package size={22} />
      </div>
      <span>{message}</span>
    </div>
  );
}
