// ─── PageLoader ───────────────────────────────────────────────────────────────
/**
 * Full-screen loading state.
 * Shown during: auth check, report generation (30s wait), PDF export.
 * @param {string} message - optional loading message
 */
export function PageLoader({ message = "Loading…" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)" }}
    >
      {/* Animated logo mark */}
      <div className="mb-5 relative">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#fafafa" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polygon
              points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"
              fill="#0a0a0a"
              fillOpacity="0.95"
            />
          </svg>
        </div>
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-xl animate-ping opacity-10"
          style={{ backgroundColor: "#fafafa" }}
        />
      </div>

      {/* Spinner */}
      <svg
        className="h-5 w-5 animate-spin mb-4"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: "#a1a1aa" }}
      >
        <circle
          className="opacity-20"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>

      <p className="text-sm font-medium" style={{ color: "#71717a" }}>{message}</p>
    </div>
  );
}
