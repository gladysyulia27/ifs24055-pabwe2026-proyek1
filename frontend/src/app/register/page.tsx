"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RegisterPayload } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/errors";
import { validateRegisterForm } from "@/utils/validation";
import { AuthHeader, AuthHero } from "@/components/auth/AuthLayoutParts";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Toast } from "@/components/common/Toast";
import { SessionCheckScreen } from "@/components/auth/SessionCheckScreen";

export default function RegisterPage() {
  const router = useRouter();
  const { user, authChecking, register, authLoading } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authChecking && user) {
      router.replace("/dashboard");
    }
  }, [user, authChecking, router]);

  if (authChecking || user) {
    return <SessionCheckScreen />;
  }

  const handleRegister = async (values: RegisterPayload) => {
    const validationErr = validateRegisterForm(values);
    if (validationErr) {
      setErrorMsg(validationErr);
      showToast(validationErr);
      return;
    }

    setErrorMsg(null);
    try {
      const newUser = await register(values);
      showToast(`Pendaftaran berhasil! Selamat datang, ${newUser.full_name}.`);
      router.replace("/dashboard");
    } catch (err) {
      const msg = getErrorMessage(err, "Pendaftaran gagal.");
      setErrorMsg(msg);
      showToast(msg);
    }
  };

  return (
    <div className="auth-gate-page">
      <AuthHeader />

      <div className="auth-gate-body">
        <div className="auth-gate-container">
          <AuthHero />

          <div className="auth-card-panel">
            <div className="auth-top-nav">
              <Link href="/" className="text-btn auth-nav-link">
                <ArrowLeft size={14} /> Beranda Publik
              </Link>
              <Link href="/about" className="text-btn auth-nav-link">
                Tentang BEM
              </Link>
            </div>

            <div className="auth-card-head">
              <h2>Pendaftaran Akun Mahasiswa</h2>
              <p>Lengkapi data diri Anda untuk membuat akun peminjaman inventori BEM IT Del.</p>
            </div>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <RegisterForm loading={authLoading} onSubmit={handleRegister} />

            <div className="auth-footer-prompt">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="auth-footer-link">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={hideToast} />
    </div>
  );
}
