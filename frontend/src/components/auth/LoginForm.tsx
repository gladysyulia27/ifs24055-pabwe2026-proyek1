"use client";

import React from "react";
import { KeyRound } from "lucide-react";
import { LoginCredentials } from "@/types";
import { Field } from "@/components/common/Field";

interface LoginFormProps {
  values: LoginCredentials;
  loading: boolean;
  onChange: (values: LoginCredentials) => void;
  onSubmit: (values: LoginCredentials) => void;
}

export function LoginForm({ values, loading, onChange, onSubmit }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <Field label="Username atau Email *">
        <input
          id="login-username"
          required
          value={values.username_or_email}
          onChange={(e) => onChange({ ...values, username_or_email: e.target.value })}
          placeholder="Contoh: andi_del atau andi@del.ac.id"
        />
      </Field>

      <Field label="Password *">
        <input
          id="login-password"
          type="password"
          required
          value={values.password}
          onChange={(e) => onChange({ ...values, password: e.target.value })}
          placeholder="••••••••"
        />
      </Field>

      <button
        type="submit"
        id="btn-submit-login"
        className="btn btn-primary btn-full auth-submit-btn"
        disabled={loading}
      >
        <KeyRound size={16} /> {loading ? "Memverifikasi..." : "Masuk ke Sistem"}
      </button>
    </form>
  );
}
