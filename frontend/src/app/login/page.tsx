"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import { LoginCredentials, User } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/errors";
import { validateLoginForm } from "@/utils/validation";
import { AuthHeader, AuthHero } from "@/components/auth/AuthLayoutParts";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { LoginForm } from "@/components/auth/LoginForm";
import { Toast } from "@/components/common/Toast";
import { SessionCheckScreen } from "@/components/auth/SessionCheckScreen";

const DEMO_PASSWORD = "bemitdel123!";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authChecking, login, authLoading, demoAccounts } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loginValues, setLoginValues] = useState<LoginCredentials>({ username_or_email: "", password: "" });

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!authChecking && user) {
      router.replace(redirectPath);
    }
  }, [user, authChecking, router, redirectPath]);

  if (authChecking || user) {
    return <SessionCheckScreen />;
  }

  const handleLogin = async (values: LoginCredentials) => {
    const validationErr = validateLoginForm(values.username_or_email, values.password);
    if (validationErr) {
      setErrorMsg(validationErr);
      showToast(validationErr);
      return;
    }

    setErrorMsg(null);
    try {
      const loggedUser = await login(values.username_or_email, values.password);
      showToast(`Selamat datang, ${loggedUser.full_name}!`);
      router.replace(redirectPath);
    } catch (err) {
      const msg = getErrorMessage(err, "Gagal masuk ke sistem.");
      setErrorMsg(msg);
      showToast(msg);
    }
  };

  const fillDemoLogin = (email: string) => {
    setLoginValues({ username_or_email: email, password: DEMO_PASSWORD });
    setErrorMsg(null);
  };

  return (
    <div className="auth-gate-page">
      <AuthHeader />

      <div className="auth-gate-body">
        <div className="auth-gate-container">
          <AuthHero />

          <div className="auth-card-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Link href="/" className="text-btn" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ArrowLeft size={14} /> Beranda Publik
              </Link>
              <Link href="/about" className="text-btn" style={{ fontSize: 13 }}>
                Tentang BEM
              </Link>
            </div>

            <div className="auth-card-head">
              <h2>Masuk ke Sistem</h2>
              <p>Masukkan username atau email dan password Anda untuk mengakses sistem manajemen inventori.</p>
            </div>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <LoginForm values={loginValues} loading={authLoading} onChange={setLoginValues} onSubmit={handleLogin} />

            <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--ink-secondary)" }}>
              Belum memiliki akun Mahasiswa?{" "}
              <Link href="/register" style={{ color: "var(--ink)", fontWeight: 700, textDecoration: "underline" }}>
                Daftar Akun Baru
              </Link>
            </div>

            <DemoAccounts accounts={demoAccounts} onSelect={fillDemoLogin} />
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={hideToast} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<SessionCheckScreen />}>
      <LoginContent />
    </Suspense>
  );
}
