"use client";

import React, { useState } from "react";
import { LogIn, UserPlus, KeyRound, UserCheck, Sparkles, ArrowRight } from "lucide-react";
import { Field } from "@/components/common/Field";
import { useAuth } from "@/hooks/useAuth";
import { validateLoginForm, validateRegisterForm } from "@/utils/validation";

interface AuthFormProps {
  onSuccess?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function AuthForm({ onSuccess, onErrorToast }: AuthFormProps) {
  const { login, register, authLoading, demoAccounts } = useAuth();
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username_or_email: "",
    password: ""
  });

  // Register form state
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    identifier: "",
    contact_phone: ""
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErr = validateLoginForm(loginForm.username_or_email, loginForm.password);
    if (validationErr) {
      setErrorMsg(validationErr);
      onErrorToast?.(validationErr);
      return;
    }

    setErrorMsg(null);
    try {
      const user = await login(loginForm.username_or_email, loginForm.password);
      onSuccess?.(`Selamat datang, ${user.full_name}!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal masuk ke sistem.";
      setErrorMsg(msg);
      onErrorToast?.(msg);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErr = validateRegisterForm(regForm);
    if (validationErr) {
      setErrorMsg(validationErr);
      onErrorToast?.(validationErr);
      return;
    }

    setErrorMsg(null);
    try {
      const user = await register(regForm);
      onSuccess?.(`Pendaftaran berhasil! Selamat datang, ${user.full_name}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Pendaftaran gagal.";
      setErrorMsg(msg);
      onErrorToast?.(msg);
    }
  };

  const fillQuickLogin = (email: string) => {
    setLoginForm({
      username_or_email: email,
      password: "bemitdel123!"
    });
    setAuthTab("login");
    setErrorMsg(null);
  };

  return (
    <div className="auth-gate-page">
      <header className="auth-gate-header">
        <div className="auth-gate-brand">
          <img src="/logo-bem-del.png?v=2" alt="Logo BEM IT Del" />
          <div className="auth-gate-brand-copy">
            <h1>BEM Institut Teknologi Del</h1>
            <span>Sistem Manajemen & Peminjaman Inventori Organisasi</span>
          </div>
        </div>
        <div className="auth-gate-badge">
          <i /> Portal Akses Resmi Mahasiswa & Pengurus
        </div>
      </header>

      <div className="auth-gate-body">
        <div className="auth-gate-container">
          {/* Left Hero Column */}
          <div className="auth-hero-section">
            <div className="auth-hero-pill">
              <Sparkles size={14} style={{ color: "var(--pink-ink)" }} />
              <span>GERBANG AUTORISASI RESMI</span>
            </div>

            <h2 className="auth-hero-title">
              Satu Pintu Akses <span>Inventori Terpadu</span> BEM IT Del
            </h2>

            <p className="auth-hero-subtitle">
              Mahasiswa dan Pengelola Departemen BEM wajib masuk terlebih dahulu untuk mengakses katalog logistik, mengajukan permohonan peminjaman, serta mengawasi ketersediaan barang.
            </p>

            <div className="auth-sway-showcase">
              <div className="auth-sway-glow" />
              <div className="auth-sway-logo-wrap">
                <img src="/logo-bem-del.png?v=2" alt="Logo Resmi BEM Institut Teknologi Del" />
                <div className="auth-sway-shadow" />
              </div>
            </div>
          </div>

          {/* Right Auth Card Panel */}
          <div className="auth-card-panel">
            <div className="auth-card-head">
              <h2>{authTab === "login" ? "Masuk ke Sistem" : "Pendaftaran Akun Baru"}</h2>
              <p>
                {authTab === "login"
                  ? "Masukkan email atau username dan password Anda. Sistem otomatis mendeteksi peran Anda."
                  : "Lengkapi data diri Anda untuk membuat akun Mahasiswa BEM IT Del."}
              </p>
            </div>

            <div className="auth-tabs" style={{ marginBottom: 18 }}>
              <button
                type="button"
                id="tab-login"
                className={`auth-tab-btn ${authTab === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthTab("login");
                  setErrorMsg(null);
                }}
              >
                <LogIn size={15} /> Masuk (Login)
              </button>
              <button
                type="button"
                id="tab-register"
                className={`auth-tab-btn ${authTab === "register" ? "active" : ""}`}
                onClick={() => {
                  setAuthTab("register");
                  setErrorMsg(null);
                }}
              >
                <UserPlus size={15} /> Daftar Akun (Register)
              </button>
            </div>

            {errorMsg && (
              <div style={{
                background: "#FFF1F0",
                border: "1px solid #FFA39E",
                color: "#C53D34",
                padding: "10px 14px",
                borderRadius: "var(--radius-inner)",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16
              }}>
                {errorMsg}
              </div>
            )}

            {authTab === "login" ? (
              <form className="form-stack" onSubmit={handleLoginSubmit}>
                <Field label="Username atau Email *">
                  <input
                    id="login-username"
                    required
                    value={loginForm.username_or_email}
                    onChange={(e) => setLoginForm({ ...loginForm, username_or_email: e.target.value })}
                    placeholder="Contoh: andi_del atau andi@del.ac.id"
                  />
                </Field>

                <Field label="Password *">
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </Field>

                <button
                  type="submit"
                  id="btn-submit-login"
                  className="btn btn-primary btn-full"
                  disabled={authLoading}
                  style={{ padding: "12px 20px", fontSize: 14 }}
                >
                  <KeyRound size={16} /> {authLoading ? "Memverifikasi..." : "Masuk ke Sistem"}
                </button>
              </form>
            ) : (
              <form className="form-stack" onSubmit={handleRegisterSubmit}>
                <div className="form-grid">
                  <Field label="Username *">
                    <input
                      id="reg-username"
                      required
                      value={regForm.username}
                      onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                      placeholder="Contoh: andi_pratama"
                    />
                  </Field>

                  <Field label="Alamat Email *">
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="andi@del.ac.id / gmail.com"
                    />
                  </Field>

                  <Field label="Nama Lengkap *">
                    <input
                      id="reg-fullname"
                      required
                      value={regForm.full_name}
                      onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
                      placeholder="Andi Pratama Simanjuntak"
                    />
                  </Field>

                  <Field label="NIM Mahasiswa *">
                    <input
                      id="reg-nim"
                      required
                      value={regForm.identifier}
                      onChange={(e) => setRegForm({ ...regForm, identifier: e.target.value })}
                      placeholder="Contoh: 11S21001"
                    />
                  </Field>

                  <Field label="Password *">
                    <input
                      id="reg-password"
                      type="password"
                      required
                      minLength={6}
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                    />
                  </Field>

                  <Field label="No. WhatsApp / HP">
                    <input
                      id="reg-phone"
                      value={regForm.contact_phone}
                      onChange={(e) => setRegForm({ ...regForm, contact_phone: e.target.value })}
                      placeholder="081234567890"
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  id="btn-submit-register"
                  className="btn btn-primary btn-full"
                  disabled={authLoading}
                  style={{ padding: "12px 20px", fontSize: 14 }}
                >
                  <UserPlus size={16} /> {authLoading ? "Mendaftarkan..." : "Daftar Akun Mahasiswa"}
                </button>
              </form>
            )}

            {/* Quick Demo Switcher */}
            {demoAccounts.length > 0 && (
              <div className="demo-accounts-box">
                <span className="demo-accounts-title">
                  <UserCheck size={14} /> Akses Cepat Uji Coba (Demo):
                </span>
                <div className="demo-chips">
                  {demoAccounts.map((acc) => (
                    <button
                      type="button"
                      key={acc.id}
                      className="demo-chip"
                      onClick={() => fillQuickLogin(acc.email)}
                      title={`Klik untuk mengisi akun ${acc.full_name} (${acc.role === "admin_departemen" ? acc.department_name : "Mahasiswa"})`}
                    >
                      <b>{acc.role === "admin_departemen" ? acc.department_name : "Mahasiswa"}</b>
                      <span>{acc.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
