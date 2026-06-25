import { Link } from "react-router-dom";
import { BrainCircuit, ArrowRight, Calendar } from "lucide-react";

// ─── ReportListItem ───────────────────────────────────────────────────────────
/**
 * Card shown in the Dashboard Reports tab.
 * @param {Object} report  - InterviewReport document (title, matchScore, createdAt, _id)
 */
export function ReportListItem({ report }) {
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const scoreColor =
    report.matchScore >= 75 ? "#a1a1aa"
    : report.matchScore >= 50 ? "#71717a"
    : "#52525b";

  const scoreBg =
    report.matchScore >= 75 ? "rgba(255,255,255,0.06)"
    : report.matchScore >= 50 ? "rgba(255,255,255,0.04)"
    : "rgba(255,255,255,0.02)";

  return (
    <div
      className="group rounded-xl p-5 flex items-center gap-4 transition-all duration-200 cursor-default"
      style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#3f3f46"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1c1c"; }}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
      >
        <BrainCircuit size={18} style={{ color: "#a1a1aa" }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {report.title || "Interview Report"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Calendar size={11} style={{ color: "#3f3f46" }} />
          <span className="text-xs" style={{ color: "#3f3f46" }}>{date}</span>
        </div>
      </div>

      {/* Score badge */}
      <div
        className="flex-shrink-0 px-2.5 py-1 rounded-full text-sm font-bold"
        style={{ color: scoreColor, backgroundColor: scoreBg, border: `1px solid ${scoreColor}33` }}
      >
        {report.matchScore}%
      </div>

      {/* View button */}
      <Link
        to={`/interview-report/${report._id}`}
        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
        style={{ border: "1px solid #262626", color: "#71717a" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = "#fafafa"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#262626"; e.currentTarget.style.color = "#71717a"; }}
      >
        View
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
