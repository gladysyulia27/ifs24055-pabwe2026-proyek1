"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { RegisterPayload } from "@/types";
import { Field } from "@/components/common/Field";

type RegisterField = keyof RegisterPayload;

interface FieldConfig {
  name: RegisterField;
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}

const FIELDS: FieldConfig[] = [
  { name: "username", id: "reg-username", label: "Username *", placeholder: "Contoh: andi_pratama", required: true },
  { name: "email", id: "reg-email", label: "Alamat Email *", placeholder: "andi@del.ac.id / gmail.com", type: "email", required: true },
  { name: "full_name", id: "reg-fullname", label: "Nama Lengkap *", placeholder: "Andi Pratama Simanjuntak", required: true },
  { name: "identifier", id: "reg-nim", label: "NIM Mahasiswa *", placeholder: "Contoh: 11S21001", required: true },
  { name: "password", id: "reg-password", label: "Password *", placeholder: "Minimal 6 karakter", type: "password", required: true, minLength: 6 },
  { name: "contact_phone", id: "reg-phone", label: "No. WhatsApp / HP", placeholder: "081234567890" }
];

const INITIAL_VALUES: Required<RegisterPayload> = {
  username: "",
  email: "",
  password: "",
  full_name: "",
  identifier: "",
  contact_phone: ""
};

interface RegisterFormProps {
  loading: boolean;
  onSubmit: (values: RegisterPayload) => void;
}

export function RegisterForm({ loading, onSubmit }: RegisterFormProps) {
  const [values, setValues] = useState(INITIAL_VALUES);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        {FIELDS.map(({ name, label, ...inputProps }) => (
          <Field key={name} label={label}>
            <input
              {...inputProps}
              value={values[name]}
              onChange={(e) => setValues((prev) => ({ ...prev, [name]: e.target.value }))}
            />
          </Field>
        ))}
      </div>

      <button
        type="submit"
        id="btn-submit-register"
        className="btn btn-primary btn-full auth-submit-btn"
        disabled={loading}
      >
        <UserPlus size={16} /> {loading ? "Mendaftarkan..." : "Daftar Akun Mahasiswa"}
      </button>
    </form>
  );
}
