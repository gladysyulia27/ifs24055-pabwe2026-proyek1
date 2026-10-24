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
        <div className="error-boundary-box">
          <div className="error-boundary-icon-badge">
            <ShieldAlert size={28} />
          </div>
          <h2 className="error-boundary-title">
            Terjadi Kendala Tampilan
          </h2>
          <p className="error-boundary-desc">
            {this.state.error?.message || "Komponen mengalami kesalahan saat memuat data antarmuka."}
          </p>
          <button
            type="button"
            className="btn btn-primary error-boundary-btn"
            onClick={this.handleReset}
          >
            <RefreshCw size={15} /> Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
