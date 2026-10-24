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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const usernameInput = form.elements.namedItem("username") as HTMLInputElement | null;
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement | null;

    const rawUsername = usernameInput?.value !== undefined ? usernameInput.value : values.username_or_email;
    const rawPassword = passwordInput?.value !== undefined ? passwordInput.value : values.password;

    const username_or_email = (rawUsername || "").trim();
    const password = rawPassword || "";

    onSubmit({ username_or_email, password });
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit} method="POST">
      <Field label="Username atau Email *">
        <input
          id="username"
          name="username"
          required
          autoComplete="username"
          value={values.username_or_email}
          onChange={(e) => onChange({ ...values, username_or_email: e.target.value })}
          placeholder="Contoh: andi_del atau andi@del.ac.id"
        />
      </Field>

      <Field label="Password *">
        <input
          id="password"
          name="password"
          type="password"
          required
          value={values.password}
          onChange={(e) => onChange({ ...values, password: e.target.value })}
          placeholder="••••••••"
        />
      </Field>

      <button
        type="submit"
        id="btn-submit"
        className="btn btn-primary btn-full auth-submit-btn"
        disabled={loading}
      >
        <KeyRound size={16} /> {loading ? "Memverifikasi..." : "Masuk ke Sistem"}
      </button>
    </form>
  );
}
