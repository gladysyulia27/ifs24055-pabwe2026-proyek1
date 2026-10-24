import React from "react";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  /** When provided, renders the "back to dashboard" button next to the eyebrow. */
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, onBack, actions }: PageHeaderProps) {
  return (
    <div className="page-heading">
      <div>
        {onBack ? (
          <div className="page-heading-action">
            <button type="button" className="page-back-btn" onClick={onBack} title="Kembali ke Dashboard">
              <ArrowLeft size={15} /> Kembali ke Dashboard
            </button>
            <span className="eyebrow">{eyebrow}</span>
          </div>
        ) : (
          <div className="eyebrow">{eyebrow}</div>
        )}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions}
    </div>
  );
}
