import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

// ─── EmptyState ───────────────────────────────────────────────────────────────
/**
 * Shown when a list is empty (no reports, no resumes).
 * @param {string} title   - heading
 * @param {string} message - body text
 * @param {string} cta     - button label (optional)
 * @param {string} to      - link destination for CTA (optional)
 */
export function EmptyState({
  title = "Nothing here yet",
  message = "Generate your first report to get started.",
  cta = "Generate a Report",
  to = "/generate",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon */}
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
      >
        <Zap size={28} style={{ color: "#52525b" }} />
      </div>

      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: "#52525b" }}>{message}</p>

      {cta && to && (
        <Link
          to={to}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-black bg-white transition-all duration-150 hover:bg-zinc-200 hover:translate-y-[-1px]"
        >
          <Zap size={14} />
          {cta}
        </Link>
      )}
    </div>
  );
}
