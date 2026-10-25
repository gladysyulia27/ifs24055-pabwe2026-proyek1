import React from "react";

interface PanelHeadProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function PanelHead({ title, subtitle, action }: PanelHeadProps) {
  return (
    <div className="panel-head">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
