import { useState, useEffect } from "react";
import { AppLayout } from "../../../components/shared/AppLayout";
import { ReportListItem } from "../components/ReportListItem";
import { ResumeCard } from "../../resume/components/ResumeCard";
import { EmptyState } from "../components/EmptyState";
import { useInterviewReport } from "../../interview/hooks/useInterviewReport";
import { useResume } from "../../resume/hooks/useResume";
import { useAuth } from "../../auth/hooks/useAuth";
import { BrainCircuit, FileText } from "lucide-react";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "reports", label: "Interview Reports", icon: BrainCircuit },
  { id: "resumes", label: "Generated Resumes",  icon: FileText     },
];

// ─── DashboardPage ────────────────────────────────────────────────────────────
/**
 * Protected page — shows user's history of reports and saved resumes.
 * Reports tab: uses interview context.
 * Resumes tab: uses resume context.
 */
export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("reports");

  const { userData }                              = useAuth();
  const { allReports, isLoading: reportLoading, handleGetAllReports } = useInterviewReport();
  const { allResumes, resumeIsLoading, handleGetUserResumes }         = useResume();

  // Fetch data on mount
  useEffect(() => {
    handleGetAllReports();
    handleGetUserResumes();
  }, []);

  const isLoading = reportLoading || resumeIsLoading;

  return (
    <AppLayout className="flex flex-col">
      <div className="mx-auto w-full max-w-5xl px-5 py-10">

        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color: "#52525b" }}>
              Welcome back,{" "}
              <span className="font-semibold" style={{ color: "#a1a1aa" }}>{userData?.userName}</span>
            </p>
          </div>
          <div className="text-xs" style={{ color: "#3f3f46" }}>
            {allReports.length} reports · {allResumes.length} resumes
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ borderBottom: "1px solid #1c1c1c" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px"
                style={{
                  color: isActive ? "#fafafa" : "#52525b",
                  borderColor: isActive ? "#fafafa" : "transparent",
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" style={{ color: "#52525b" }}>
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : activeTab === "reports" ? (
          allReports.length > 0 ? (
            <div className="space-y-3">
              {allReports.map((report) => (
                <ReportListItem key={report._id} report={report} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No interview reports yet"
              message="Generate your first AI-powered interview prep report to get started."
              cta="Generate a Report"
              to="/generate"
            />
          )
        ) : (
          allResumes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allResumes.map((resume) => (
                <ResumeCard key={resume._id} resume={resume} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No resumes generated yet"
              message="Open any interview report and click 'Generate Resume PDF' to create your first AI-rewritten resume."
              cta="Go to My Reports"
              to="/dashboard"
            />
          )
        )}
      </div>
    </AppLayout>
  );
}
