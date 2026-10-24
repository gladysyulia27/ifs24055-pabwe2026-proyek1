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
      {error && <span style={{ color: "#C53D34", fontSize: 11.5, fontWeight: 600, marginTop: 4 }}>{error}</span>}
      {help && !error && <p className="field-help" style={{ margin: "4px 0 0" }}>{help}</p>}
    </label>
  );
}
