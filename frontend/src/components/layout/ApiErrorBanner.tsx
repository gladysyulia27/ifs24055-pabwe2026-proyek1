import React from "react";
import { Activity } from "lucide-react";

interface ApiErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function ApiErrorBanner({ message, onRetry }: ApiErrorBannerProps) {
  return (
    <div className="error-banner">
      <Activity size={18} />
      <div>
        <b>API belum tersambung</b>
        <span>
          {message}. Pastikan backend Express aktif di <code>localhost:4000</code>.
        </span>
      </div>
      <button type="button" onClick={onRetry} className="btn btn-small">
        Coba lagi
      </button>
    </div>
  );
}
