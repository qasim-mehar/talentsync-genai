/**
 * GapsSidebar — Right sidebar showing identified skill gaps as small tag boxes.
 * Pure UI component. Receives `gaps` array from parent.
 *
 * Expected gap shape: { id, title, severity: "high" | "medium" | "low" }
 */

const SEVERITY_OPACITY = {
  high: "bg-zinc-900 text-white",
  medium: "bg-zinc-200 text-zinc-700",
  low: "bg-zinc-100 text-zinc-500",
};

export function GapsSidebar({ gaps = [] }) {
  return (
    <aside className="w-[220px] shrink-0 border-l border-zinc-200 bg-zinc-50/40 px-4 py-6 overflow-y-auto hidden lg:flex flex-col">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200/70">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Gaps
        </h2>
      </div>

      {/* Gap Tags */}
      {gaps.length === 0 ? (
        <p className="text-xs text-zinc-400 leading-relaxed">
          No gaps identified — great job!
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {gaps.map((gap) => {
            const style = SEVERITY_OPACITY[gap.severity] || SEVERITY_OPACITY.low;
            return (
              <div
                key={gap.id}
                className={`
                  inline-flex items-center rounded-lg px-3 py-2
                  text-xs font-medium leading-tight
                  transition-opacity duration-150 cursor-default
                  ${style}
                `}
              >
                {gap.title}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary count */}
      {gaps.length > 0 && (
        <div className="mt-5 pt-4 border-t border-zinc-200">
          <p className="text-[11px] text-zinc-400">
            {gaps.length} gap{gaps.length !== 1 ? "s" : ""} identified
          </p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
}
