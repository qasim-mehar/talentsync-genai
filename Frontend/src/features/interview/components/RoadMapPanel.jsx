/**
 * RoadMapPanel — Displays a preparation roadmap as a vertical timeline.
 * Expected step shape:
 * { id, title, description, duration: string, status: "completed" | "current" | "upcoming" }
 */

const STATUS_STYLES = {
  completed: { dot: "bg-zinc-900", line: "bg-zinc-400", title: "text-zinc-900", badge: "bg-zinc-900 text-white border-zinc-900", badgeText: "Completed" },
  current: { dot: "bg-zinc-600", line: "bg-zinc-300", title: "text-zinc-900", badge: "bg-zinc-200 text-zinc-700 border-zinc-300", badgeText: "In Progress" },
  upcoming: { dot: "bg-zinc-300", line: "bg-zinc-200", title: "text-zinc-500", badge: "bg-zinc-100 text-zinc-400 border-zinc-200", badgeText: "Upcoming" },
};

export function RoadMapPanel({ steps = [] }) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-zinc-900">Preparation Road Map</h2>
        <p className="text-sm text-zinc-400 mt-0.5">A step-by-step plan to get interview-ready</p>
      </div>
      {steps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center">
          <p className="text-sm text-zinc-400">No roadmap generated yet.</p>
        </div>
      ) : (
        <div className="relative">
          {steps.map((step, index) => {
            const style = STATUS_STYLES[step.status] || STATUS_STYLES.upcoming;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.id} className="relative flex gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className={`relative z-10 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${style.dot}`}>
                    {step.status === "current" && <span className="absolute inset-0 animate-ping rounded-full bg-zinc-600 opacity-20" />}
                  </div>
                  {!isLast && <div className={`w-0.5 flex-1 mt-1 rounded-full ${style.line}`} />}
                </div>
                <div className={`flex-1 rounded-xl border px-4 py-3.5 -mt-1 transition-colors ${step.status === "current" ? "border-zinc-300 bg-white shadow-sm" : "border-zinc-200 bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-relaxed ${style.title}`}>{step.title}</p>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{step.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${style.badge}`}>{style.badgeText}</span>
                      {step.duration && (
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
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
