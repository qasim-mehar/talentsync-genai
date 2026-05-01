/**
 * ReportNavSidebar — Left sidebar with tab navigation and match score.
 * Pure UI component. Receives activeTab + onTabChange from parent.
 */

const TABS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

export function ReportNavSidebar({ activeTab, onTabChange, matchScore = 0 }) {
  return (
    <aside className="w-[240px] shrink-0 border-r border-zinc-200 bg-white px-4 py-6 overflow-y-auto hidden lg:flex flex-col">
      {/* Tab heading */}
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-3 px-1">
        Sections
      </h2>

      {/* Tab Navigation */}
      <nav className="flex flex-col gap-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`report-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium
                transition-all duration-200 text-left w-full
                ${isActive
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                }
              `}
            >
              <span className={`shrink-0 ${isActive ? "text-zinc-300" : "text-zinc-400"}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="my-6 border-t border-zinc-100" />

      {/* Match Score */}
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Match Score
        </h3>
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Background circle */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#f4f4f5"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#18181b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(matchScore / 100) * 264} 264`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="text-lg font-bold text-zinc-900">{matchScore}%</span>
        </div>
        <p className="text-[11px] text-zinc-400 text-center">
          Resume-to-job alignment
        </p>
      </div>

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* Quick actions */}
      <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-2">
        <button className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors px-1 py-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Report
        </button>
        <button className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors px-1 py-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Generate Again
        </button>
      </div>
    </aside>
  );
}
