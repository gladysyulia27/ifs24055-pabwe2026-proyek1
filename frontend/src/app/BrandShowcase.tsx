"use client";

import React, { useState } from "react";
import { Stethoscope, Briefcase, Pill, Syringe, Sparkles, Check, Copy } from "lucide-react";

export function BrandLogoMark({ size = 120, inverted = false, showGrid = false }: { size?: number; inverted?: boolean; showGrid?: boolean }) {
  const gridColor = "#D5CEBE";

  return (
    <div style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center" }}>
      {showGrid && (
        <svg
          viewBox="0 0 160 160"
          width={size}
          height={size}
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke={gridColor} strokeWidth="1" fill="none" opacity="0.85">
            <rect x="10" y="10" width="140" height="140" rx="34" />
            <rect x="20" y="20" width="120" height="120" rx="26" strokeDasharray="3 3" />
            <line x1="10" y1="80" x2="150" y2="80" />
            <line x1="80" y1="10" x2="80" y2="150" />
            <line x1="20" y1="20" x2="140" y2="140" strokeDasharray="2 2" />
            <line x1="140" y1="20" x2="20" y2="140" strokeDasharray="2 2" />
            <circle cx="80" cy="80" r="62" />
            <circle cx="80" cy="80" r="44" strokeDasharray="3 3" />
            <circle cx="80" cy="80" r="26" strokeDasharray="2 2" />
          </g>
        </svg>
      )}
      <img
        src="/logo-bem-del.png"
        alt="Logo BEM Institut Teknologi Del"
        style={{
          width: showGrid ? size * 0.72 : size * 0.82,
          height: showGrid ? size * 0.72 : size * 0.82,
          objectFit: "contain",
          display: "block",
          filter: inverted ? "drop-shadow(0 4px 10px rgba(0,0,0,0.12))" : "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// Microbe / Virus custom SVG icon matching the first yellow circle
export function MicrobeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="14" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

export function BrandShowcaseSection() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    { hex: "#F5B8DB", label: "#F5B8DB", name: "Soft Blush Pink", bg: "#F5B8DB", text: "#1C1C1E" },
    { hex: "#9AAB63", label: "#9AAB63", name: "Olive Sage Green", bg: "#9AAB63", text: "#1C1C1E" },
    { hex: "#B6CAEB", label: "#B6CAEB", name: "Pastel Sky Blue", bg: "#B6CAEB", text: "#1C1C1E" },
    { hex: "#F5D867", label: "#F5D867", name: "Warm Honey Yellow", bg: "#F5D867", text: "#1C1C1E" }
  ];

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="brand-spec-container">
      {/* Top Action Pills matching reference */}
      <div className="brand-top-pills">
        <span className="pill-badge-pink">ICON</span>
        <span className="pill-badge-pink">FONTS</span>
        <span className="pill-badge-pink">COLORS</span>
      </div>

      {/* Showcase Cards Row */}
      <div className="brand-cards-track">
        {/* Card 1: Acorn Font */}
        <div className="brand-card card-font">
          <div className="dashed-pill">USED FONTS</div>
          <div className="font-preview-acorn">Aa</div>
          <div className="font-label">Acorn</div>
        </div>

        {/* Card 2: Tags */}
        <div className="brand-card card-tags">
          <div className="dashed-pill">TAGS</div>
          <div className="tags-stack">
            <span className="tag-pill-pink">Fever</span>
            <span className="tag-pill-pink">Caught</span>
            <span className="tag-pill-pink">Heart Burn</span>
          </div>
        </div>

        {/* Card 3: Icon Logo Mark & Color Swatches */}
        <div className="brand-card card-logo-center">
          <div className="logo-duo">
            {/* Grid Version */}
            <div className="logo-grid-box">
              <BrandLogoMark size={140} showGrid={true} />
            </div>

            {/* Pink Squircle Version */}
            <div className="logo-pink-box">
              <BrandLogoMark size={110} inverted={true} />
            </div>
          </div>

          {/* Color Pallet Swatches */}
          <div className="color-swatches-row">
            {colors.map((c) => (
              <button
                key={c.hex}
                className="color-chip-btn"
                style={{ backgroundColor: c.bg, color: c.text }}
                onClick={() => copyToClipboard(c.hex)}
                title={`Klik untuk salin ${c.name} (${c.hex})`}
              >
                {copiedColor === c.hex ? <Check size={13} /> : null}
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card 4: Medical / Circular Icons */}
        <div className="brand-card card-icons">
          <div className="dashed-pill">MEDICAL ICONS</div>
          <div className="icon-badge-grid">
            <div className="circle-badge badge-yellow" title="Microbe / Virus">
              <MicrobeIcon size={19} />
            </div>
            <div className="circle-badge badge-pink" title="Stethoscope">
              <Stethoscope size={19} />
            </div>
            <div className="circle-badge badge-green" title="First Aid / Kit">
              <Briefcase size={18} />
            </div>
            <div className="circle-badge badge-yellow" title="Pill / Medicine">
              <Pill size={19} />
            </div>
            <div className="circle-badge badge-blue" title="Syringe">
              <Syringe size={19} />
            </div>
          </div>
        </div>

        {/* Card 5: TT Commons Font */}
        <div className="brand-card card-font">
          <div className="dashed-pill">USED FONTS</div>
          <div className="font-preview-commons">Aa</div>
          <div className="font-label">TT Commons</div>
        </div>
      </div>
    </div>
  );
}
