/**
 * ErrorCard — A styled error/warning card to surface API errors or validation
 * messages to the user. Replaces silent console.error patterns.
 *
 * Props:
 *  - title: string (required)   — short description of the problem
 *  - body:  string (optional)   — extra details / suggestions
 *  - type:  "error" | "warning" | "info"  (default "error")
 *  - onDismiss: () => void (optional) — if provided, shows a dismiss (×) button
 */

import { XCircle, AlertTriangle, Info, X } from "lucide-react";

const TYPE_CONFIG = {
  error: {
    icon: XCircle,
    bg: "rgba(255,255,255,0.02)",
    border: "rgba(255,255,255,0.1)",
    iconColor: "#fafafa",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
  },
  warning: {
    icon: AlertTriangle,
    bg: "rgba(255,255,255,0.02)",
    border: "rgba(255,255,255,0.1)",
    iconColor: "#fafafa",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
  },
  info: {
    icon: Info,
    bg: "rgba(255,255,255,0.02)",
    border: "rgba(255,255,255,0.1)",
    iconColor: "#fafafa",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
  },
};

export function ErrorCard({ title, body, type = "error", onDismiss }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.error;
  const Icon = cfg.icon;

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        borderRadius: "12px",
        padding: "14px 16px",
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        marginBottom: "16px",
      }}
    >
      <Icon size={16} style={{ color: cfg.iconColor, flexShrink: 0, marginTop: "1px" }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: cfg.titleColor, marginBottom: body ? "4px" : 0 }}>
          {title}
        </p>
        {body && (
          <p style={{ fontSize: "12px", color: cfg.bodyColor, lineHeight: "1.5" }}>
            {body}
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            color: "#52525b",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
