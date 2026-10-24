"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          padding: "40px 20px",
          textAlign: "center"
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#FFF1F0",
            display: "grid",
            placeItems: "center",
            color: "#C53D34",
            marginBottom: 16
          }}>
            <ShieldAlert size={28} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 8px", color: "var(--ink)" }}>
            Terjadi Kendala Tampilan
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: 14, maxWidth: 440, margin: "0 0 20px" }}>
            {this.state.error?.message || "Komponen mengalami kesalahan saat memuat data antarmuka."}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleReset}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <RefreshCw size={15} /> Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
