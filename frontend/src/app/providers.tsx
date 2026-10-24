"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  );
}
