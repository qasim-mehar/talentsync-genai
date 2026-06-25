// ─── MatchScoreBadge ──────────────────────────────────────────────────────────
/**
 * Radial SVG arc score indicator.
 * Monochrome: all scores shown in white/zinc tones.
 * @param {number} score  0–100
 * @param {number} size   diameter in px (default 96)
 */
export function MatchScoreBadge({ score = 0, size = 96 }) {
  const r = size * 0.38;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  // Monochrome colour scale
  const color =
    score >= 75 ? "#fafafa"
    : score >= 50 ? "#a1a1aa"
    : "#52525b";

  const bgColor =
    score >= 75 ? "rgba(255,255,255,0.06)"
    : score >= 50 ? "rgba(255,255,255,0.04)"
    : "rgba(255,255,255,0.02)";

  const label =
    score >= 75 ? "Strong match"
    : score >= 50 ? "Partial match"
    : "Weak match";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 -rotate-90"
        >
          {/* Track */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke="#1c1c1c"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        {/* Centre content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold leading-none"
            style={{ fontSize: size * 0.24, color }}
          >
            {score}
          </span>
          <span style={{ fontSize: size * 0.11, color: "#27272a" }}>/100</span>
        </div>
      </div>
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full border"
        style={{ color, backgroundColor: bgColor, borderColor: color + "40" }}
      >
        {label}
      </span>
    </div>
  );
}
