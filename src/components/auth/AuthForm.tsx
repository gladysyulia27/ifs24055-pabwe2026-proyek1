"use client";

import React, { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { LoginCredentials, RegisterPayload, User } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errors";
import { validateLoginForm, validateRegisterForm } from "@/utils/validation";
import { AuthHeader, AuthHero } from "@/components/auth/AuthLayoutParts";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

type AuthTab = "login" | "register";

const DEMO_PASSWORD = "bemitdel123!";

const TAB_COPY: Record<AuthTab, { title: string; description: string }> = {
  login: {
    title: "Masuk ke Sistem",
    description: "Masukkan email atau username dan password Anda. Sistem otomatis mendeteksi peran Anda."
  },
  register: {
    title: "Pendaftaran Akun Baru",
    description: "Lengkapi data diri Anda untuk membuat akun Mahasiswa BEM IT Del."
  }
};

interface AuthFormProps {
  onSuccess?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function AuthForm({ onSuccess, onErrorToast }: AuthFormProps) {
  const { login, register, authLoading, demoAccounts } = useAuth();
  const [tab, setTab] = useState<AuthTab>("login");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loginValues, setLoginValues] = useState<LoginCredentials>({ username_or_email: "", password: "" });

  const reportError = (message: string) => {
    setErrorMsg(message);
    onErrorToast?.(message);
  };

  const switchTab = (next: AuthTab) => {
    setTab(next);
    setErrorMsg(null);
  };

  /** Validates, runs the auth call and reports success/failure the same way for login and register. */
  const authenticate = async (
    validationError: string | null,
    action: () => Promise<User>,
    successMessage: (user: User) => string,
    fallbackError: string
  ) => {
    if (validationError) return reportError(validationError);
    setErrorMsg(null);
    try {
      onSuccess?.(successMessage(await action()));
    } catch (err) {
      reportError(getErrorMessage(err, fallbackError));
    }
  };

  const handleLogin = (values: LoginCredentials) =>
    authenticate(
      validateLoginForm(values.username_or_email, values.password),
      () => login(values.username_or_email, values.password),
      (user) => `Selamat datang, ${user.full_name}!`,
      "Gagal masuk ke sistem."
    );

  const handleRegister = async (values: RegisterPayload) => {
    const validationErr = validateRegisterForm(values);
    if (validationErr) return reportError(validationErr);
    setErrorMsg(null);
    try {
      await register(values);
      switchTab("login");
      setLoginValues((prev) => ({ ...prev, username_or_email: values.username }));
      onSuccess?.("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.");
    } catch (err) {
      reportError(getErrorMessage(err, "Pendaftaran gagal."));
    }
  };

  const fillDemoLogin = (email: string) => {
    setLoginValues({ username_or_email: email, password: DEMO_PASSWORD });
    switchTab("login");
  };

  return (
    <div className="auth-gate-page">
      <AuthHeader />

      <div className="auth-gate-body">
        <div className="auth-gate-container">
          <AuthHero />

          <div className="auth-card-panel">
            <div className="auth-card-head">
              <h2>{TAB_COPY[tab].title}</h2>
              <p>{TAB_COPY[tab].description}</p>
            </div>

            <div className="auth-tabs auth-tabs-spaced">
              <button
                type="button"
                id="tab-login"
                className={`auth-tab-btn ${tab === "login" ? "active" : ""}`}
                onClick={() => switchTab("login")}
              >
                <LogIn size={15} /> Masuk (Login)
              </button>
              <button
                type="button"
                id="tab-register"
                className={`auth-tab-btn ${tab === "register" ? "active" : ""}`}
                onClick={() => switchTab("register")}
              >
                <UserPlus size={15} /> Daftar Akun (Register)
              </button>
            </div>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            {tab === "login" ? (
              <LoginForm values={loginValues} loading={authLoading} onChange={setLoginValues} onSubmit={handleLogin} />
            ) : (
              <RegisterForm loading={authLoading} onSubmit={handleRegister} />
            )}

            <DemoAccounts accounts={demoAccounts} onSelect={fillDemoLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
