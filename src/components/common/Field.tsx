import React from "react";

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  help?: string;
}

export function Field({ label, children, error, help }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
      {help && !error && <p className="field-help field-help-spaced">{help}</p>}
    </label>
  );
}
