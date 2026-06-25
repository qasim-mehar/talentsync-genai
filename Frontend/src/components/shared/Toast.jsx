import { createContext, useCallback, useContext, useReducer, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Reducer ──────────────────────────────────────────────────────────────────
function toastReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    bg: "#111111",
    border: "#262626",
    iconColor: "#fafafa",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
    progressColor: "#fafafa",
  },
  error: {
    icon: XCircle,
    bg: "#111111",
    border: "#262626",
    iconColor: "#fafafa",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
    progressColor: "#fafafa",
  },
  warning: {
    icon: AlertTriangle,
    bg: "#111111",
    border: "#262626",
    iconColor: "#fafafa",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
    progressColor: "#fafafa",
  },
  info: {
    icon: Info,
    bg: "#111111",
    border: "#262626",
    iconColor: "#fafafa",
    titleColor: "#fafafa",
    bodyColor: "#a1a1aa",
    progressColor: "#fafafa",
  },
};

// ─── Single Toast Item ─────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }) {
  const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
  const Icon = cfg.icon;
  const duration = toast.duration ?? 5000;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        backgroundColor: "#111111",
        border: `1px solid ${cfg.border}`,
        borderRadius: "14px",
        padding: "14px 16px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        animation: "ts-toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
        overflow: "hidden",
        minWidth: "300px",
        maxWidth: "420px",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          backgroundColor: cfg.progressColor,
          width: "100%",
          animation: `ts-toast-progress ${duration}ms linear forwards`,
          transformOrigin: "left",
        }}
      />

      {/* Icon */}
      <Icon size={18} style={{ color: cfg.iconColor, flexShrink: 0, marginTop: "1px" }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <p style={{ fontSize: "13px", fontWeight: 600, color: cfg.titleColor, marginBottom: toast.body ? "3px" : 0 }}>
            {toast.title}
          </p>
        )}
        {toast.body && (
          <p style={{ fontSize: "12px", color: "#71717a", lineHeight: "1.5" }}>
            {toast.body}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          color: "#52525b",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          display: "flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const idRef = useRef(0);

  const addToast = useCallback(({ type = "info", title, body, duration = 5000 }) => {
    const id = ++idRef.current;
    dispatch({ type: "ADD", toast: { id, type, title, body, duration } });
    setTimeout(() => dispatch({ type: "REMOVE", id }), duration);
  }, []);

  const removeToast = useCallback((id) => dispatch({ type: "REMOVE", id }), []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div
        aria-label="Notifications"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes ts-toast-in {
          from { opacity: 0; transform: translateX(24px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes ts-toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
