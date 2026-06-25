import { TrendingUp, TrendingDown } from "lucide-react";

// ─── ScoreDelta ───────────────────────────────────────────────────────────────
/**
 * Displays before → after resume quality scores.
 * @param {number} before  0–100
 * @param {number} after   0–100
 */
export function ScoreDelta({ before = 0, after = 0 }) {
  const delta = after - before;
  const isPositive = delta > 0;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{ border: "1px solid #1c1c1c", backgroundColor: "#0a0a0a" }}
    >
      {/* Before */}
      <div className="text-center flex-1">
        <p className="text-xs font-medium mb-0.5" style={{ color: "#3f3f46" }}>Before</p>
        <p className="text-2xl font-bold" style={{ color: "#52525b" }}>{before}</p>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center">
        {isPositive
          ? <TrendingUp size={18} style={{ color: "#a1a1aa" }} />
          : <TrendingDown size={18} style={{ color: "#52525b" }} />
        }
        <span
          className="text-xs font-bold mt-0.5"
          style={{ color: isPositive ? "#a1a1aa" : "#52525b" }}
        >
          {isPositive ? "+" : ""}{delta}
        </span>
      </div>

      {/* After */}
      <div className="text-center flex-1">
        <p className="text-xs font-medium mb-0.5" style={{ color: "#71717a" }}>After</p>
        <p className="text-2xl font-bold text-white">{after}</p>
      </div>
    </div>
  );
}
