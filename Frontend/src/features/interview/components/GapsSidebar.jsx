/**
 * GapsSidebar — Right sidebar showing identified skill gaps as small tag boxes.
 * Pure UI component. Receives `gaps` array from parent.
 *
 * Expected gap shape: { id, title, severity: "high" | "medium" | "low" }
 */

const SEVERITY_STYLES = {
  high:   { color: "#fafafa", bg: "#18181b", border: "#3f3f46" },
  medium: { color: "#a1a1aa", bg: "#111111", border: "#27272a" },
  low:    { color: "#52525b", bg: "#111111", border: "#1c1c1c" },
};

export function GapsSidebar({ gaps = [] }) {
  return (
    <aside
      className="w-[220px] shrink-0 px-4 py-6 overflow-y-auto hidden lg:flex flex-col"
      style={{ borderLeft: "1px solid #1c1c1c", backgroundColor: "#0a0a0a" }}
    >
      {/* Heading */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#111111", border: "1px solid #1c1c1c" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#3f3f46" }}>
          Skill Gaps
        </h2>
      </div>

      {/* Gap Tags */}
      {gaps.length === 0 ? (
        <p className="text-xs leading-relaxed" style={{ color: "#27272a" }}>
          No gaps identified — great job!
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {gaps.map((gap) => {
            const style = SEVERITY_STYLES[gap.severity] || SEVERITY_STYLES.low;
            return (
              <div
                key={gap.id}
                className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium leading-tight cursor-default"
                style={{ color: style.color, backgroundColor: style.bg, border: `1px solid ${style.border}` }}
              >
                {gap.title}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary count */}
      {gaps.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: "1px solid #1c1c1c" }}>
          <p className="text-[11px]" style={{ color: "#27272a" }}>
            {gaps.length} gap{gaps.length !== 1 ? "s" : ""} identified
          </p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
}
