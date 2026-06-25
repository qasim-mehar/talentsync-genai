/**
 * RoadMapPanel — Displays a preparation roadmap as a vertical timeline.
 * Expected step shape:
 * { id, title, description, duration: string, status: "completed" | "current" | "upcoming" }
 */

const STATUS_STYLES = {
  completed: { dot: "#fafafa", title: "#ffffff", badge: "#fafafa", badgeBg: "#18181b", badgeBorder: "#3f3f46", badgeText: "Completed" },
  current:   { dot: "#e4e4e7", title: "#ffffff", badge: "#fafafa", badgeBg: "#111111", badgeBorder: "#27272a", badgeText: "In Progress" },
  upcoming:  { dot: "#52525b", title: "#e4e4e7", badge: "#a1a1aa", badgeBg: "#0a0a0a", badgeBorder: "#262626", badgeText: "Upcoming" },
};

export function RoadMapPanel({ steps = [] }) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-white">Preparation Road Map</h2>
        <p className="text-sm mt-0.5" style={{ color: "#52525b" }}>
          A step-by-step plan to get interview-ready
        </p>
      </div>
      {steps.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: "#1c1c1c" }}>
          <p className="text-sm" style={{ color: "#3f3f46" }}>No roadmap generated yet.</p>
        </div>
      ) : (
        <div className="relative">
          {steps.map((step, index) => {
            const style = STATUS_STYLES[step.status] || STATUS_STYLES.upcoming;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.id} className="relative flex gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div
                    className="relative z-10 h-3.5 w-3.5 rounded-full border-2"
                    style={{ backgroundColor: style.dot, borderColor: "#0a0a0a" }}
                  >
                    {step.status === "current" && (
                      <span
                        className="absolute inset-0 animate-ping rounded-full opacity-20"
                        style={{ backgroundColor: style.dot }}
                      />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 mt-1 rounded-full"
                      style={{ backgroundColor: "#1c1c1c" }}
                    />
                  )}
                </div>
                <div
                  className="flex-1 rounded-xl px-4 py-3.5 -mt-1 transition-colors"
                  style={{
                    border: `1px solid ${step.status === "current" ? "#3f3f46" : "#1c1c1c"}`,
                    backgroundColor: step.status === "current" ? "#111111" : "#0a0a0a",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium leading-relaxed"
                        style={{ color: style.title }}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "#a1a1aa" }}>
                        {step.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className="text-[10px] font-semibold rounded-full border px-2 py-0.5"
                        style={{ color: style.badge, backgroundColor: style.badgeBg, borderColor: style.badgeBorder }}
                      >
                        {style.badgeText}
                      </span>
                      {step.duration && (
                        <span className="text-[11px] flex items-center gap-1" style={{ color: "#3f3f46" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {step.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
