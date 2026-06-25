import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GapsSidebar } from "../components/GapsSidebar";
import { TechnicalQuestionsPanel } from "../components/TechnicalQuestionsPanel";
import { BehavioralQuestionsPanel } from "../components/BehavioralQuestionsPanel";
import { RoadMapPanel } from "../components/RoadMapPanel";
import { MatchScoreBadge } from "../components/MatchScoreBadge";
import { useInterviewReport } from "../hooks/useInterviewReport";
import { useResume } from "../../resume/hooks/useResume";
import { useAuth } from "../../auth/hooks/useAuth";
import { toast } from "sonner";
import { ErrorCard } from "../../../components/shared/ErrorCard";
import { PageLoader } from "../../../components/shared/PageLoader";
import {
  BrainCircuit, MessageSquare, Map, Home, FileText, ChevronRight, Sparkles,
} from "lucide-react";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "technical",  label: "Technical",  icon: BrainCircuit  },
  { id: "behavioral", label: "Behavioral", icon: MessageSquare },
  { id: "roadmap",    label: "Roadmap",    icon: Map           },
];

const TAB_PANELS = {
  technical:  TechnicalQuestionsPanel,
  behavioral: BehavioralQuestionsPanel,
  roadmap:    RoadMapPanel,
};

// ─── InterviewReportPage ──────────────────────────────────────────────────────
export function InterviewReportPage() {
  const { reportId } = useParams();
  const [activeTab, setActiveTab] = useState("technical");
  const [resumeError, setResumeError] = useState(null);
  const [reportLoadError, setReportLoadError] = useState(null);

  const { isLoading, report, handleGetReportById } = useInterviewReport();
  const { resumeIsLoading, handleGenerateResume, handleGenerateResumePublic } = useResume();
  const { userData } = useAuth();

  useEffect(() => {
    if (reportId && (!report || report._id !== reportId)) {
      handleGetReportById(reportId).catch((err) => {
        setReportLoadError(err?.message || "Failed to load interview report.");
      });
    }
  }, [reportId]);

  if (isLoading || (!report && !reportLoadError)) {
    return <PageLoader message="Loading your interview report…" />;
  }

  // ── Report load failure ──
  if (reportLoadError && !report) {
    return (
      <div
        className="flex h-screen items-center justify-center px-6"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <ErrorCard
            title="Could not load report"
            body={reportLoadError}
            type="error"
          />
          <Link
            to="/generate"
            className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl text-sm font-semibold text-black bg-white hover:bg-zinc-200 transition-all"
          >
            Generate a New Report
          </Link>
        </div>
      </div>
    );
  }

  // ── Handle resume generation (logged-in path) ──
  const handleResumeFromReport = async () => {
    setResumeError(null);
    try {
      await handleGenerateResume(reportId);
      toast.success("Resume ready!", {
        description: "Your AI-rewritten resume is ready. You can now download it as PDF.",
      });
    } catch (err) {
      const msg = err?.message || "Resume generation failed. Please try again.";
      setResumeError(msg);
      toast.error("Resume generation failed", { description: msg });
    }
  };

  // ── Handle resume generation (public path — no login) ──
  const handleResumePublic = async () => {
    setResumeError(null);
    if (!report) return;
    try {
      await handleGenerateResumePublic({
        resumeFile: null,       // public path requires file; fallback: redirect to /generate
        jobDescription: report.jobDescription || "",
        selfDescription: report.selfDescription || "",
      });
      toast.success("Resume ready!", {
        description: "Your AI-rewritten resume is ready. Log in to save it.",
      });
    } catch (err) {
      const msg = err?.message || "Resume generation failed. Please try again.";
      setResumeError(msg);
      toast.error("Resume generation failed", { description: msg });
    }
  };

  // ── Map backend data to component prop shapes ──
  const mappedTechnical = (report.technicalQuestions ?? []).map((q, i) => ({
    id: `t${i}`,
    question: q.question,
    sampleAnswer: q.answer,
    interviewerIntention: q.intention,
    difficulty: q.difficultyLevel,
  }));

  const mappedBehavioral = (report.behavioralQuestions ?? []).map((q, i) => ({
    id: `b${i}`,
    question: q.question,
    sampleAnswer: q.answer,
    interviewerIntention: q.intention,
    category: q.category,
  }));

  const mappedRoadmap = (report.preparationPlan ?? []).map((plan, i) => ({
    id: `r${i}`,
    title: plan.focus,
    description: plan.tasks?.join(" • ") ?? "",
    duration: `Day ${plan.day}`,
    status: "upcoming",
  }));

  const mappedGaps = (report.skillGaps ?? []).map((gap, i) => ({
    id: `g${i}`,
    title: gap.skill,
    severity: gap.severity,
  }));

  const TAB_DATA = {
    technical:  { questions: mappedTechnical  },
    behavioral: { questions: mappedBehavioral },
    roadmap:    { steps: mappedRoadmap        },
  };

  const ActivePanel = TAB_PANELS[activeTab];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 overflow-y-auto"
        style={{ backgroundColor: "#111111", borderRight: "1px solid #1c1c1c" }}
      >
        {/* Logo */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #1c1c1c" }}>
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md transition-opacity group-hover:opacity-80"
              style={{ backgroundColor: "#fafafa" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="#0a0a0a" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">TalentSync</span>
          </Link>
        </div>

        {/* Score */}
        <div className="px-5 py-6 flex flex-col items-center" style={{ borderBottom: "1px solid #1c1c1c" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#3f3f46" }}>
            Match Score
          </p>
          <MatchScoreBadge score={report.matchScore} size={100} />
        </div>

        {/* Tabs */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  color: isActive ? "#fafafa" : "#52525b",
                }}
              >
                <Icon size={15} />
                {tab.label}
                {isActive && (
                  <ChevronRight size={13} className="ml-auto" style={{ color: "#71717a" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Generate Resume CTA */}
        <div className="px-3 pb-5">

          {/* Error card for resume failures */}
          {resumeError && (
            <div className="mb-3">
              <ErrorCard
                title="Resume generation failed"
                body={resumeError}
                type="error"
                onDismiss={() => setResumeError(null)}
              />
            </div>
          )}

          {/* Resume feature card */}
          <div
            className="rounded-xl p-4 mb-3"
            style={{
              border: "1px solid #262626",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} style={{ color: "#fafafa" }} />
              <p className="text-xs font-semibold" style={{ color: "#fafafa" }}>
                AI Resume Rewrite
              </p>
            </div>
            <p className="text-xs mb-3 leading-snug" style={{ color: "#a1a1aa" }}>
              Get an ATS-ready, one-page PDF resume rewritten by AI from this report.
            </p>
            {userData ? (
              <button
                onClick={handleResumeFromReport}
                disabled={resumeIsLoading}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#fafafa",
                  color: "#0a0a0a",
                  boxShadow: "0 0 12px rgba(255,255,255,0.1)",
                }}
              >
                <FileText size={13} />
                {resumeIsLoading ? "Generating…" : "Generate Resume PDF"}
              </button>
            ) : (
              /* Not logged in — still allow via public endpoint (redirect to /generate with file) */
              <Link
                to="/generate"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all hover:translate-y-[-1px]"
                style={{
                  background: "#fafafa",
                  color: "#0a0a0a",
                  boxShadow: "0 0 12px rgba(255,255,255,0.1)",
                  display: "flex",
                }}
              >
                <FileText size={13} />
                Generate Resume PDF
              </Link>
            )}
          </div>

          <Link
            to="/generate"
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{ color: "#3f3f46" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3f3f46"; e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <Home size={13} />
            New Report
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center gap-3 px-5 py-3"
          style={{
            borderBottom: "1px solid #1c1c1c",
            backgroundColor: "rgba(10,10,10,0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Mobile: back + title */}
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors lg:hidden"
            style={{ color: "#3f3f46" }}
            onMouseEnter={e => e.currentTarget.style.color = "#71717a"}
            onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}
          >
            <Home size={13} />
            Home
          </Link>
          <span className="lg:hidden" style={{ color: "#262626" }}>/</span>

          {/* Desktop: back button */}
          <Link
            to="/dashboard"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#a1a1aa" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fafafa"}
            onMouseLeave={e => e.currentTarget.style.color = "#a1a1aa"}
          >
            <Home size={13} />
            Back to Dashboard
          </Link>

          <span className="text-sm font-semibold text-white truncate lg:ml-2">
            {report.title || "Interview Report"}
          </span>

          {/* Mobile tab selector */}
          <div className="ml-auto lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="rounded-lg px-2 py-1.5 text-xs outline-none"
              style={{
                border: "1px solid #262626",
                backgroundColor: "#111111",
                color: "#a1a1aa",
              }}
            >
              {TABS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Mobile — generate resume button */}
          <div className="lg:hidden">
            {userData ? (
              <button
                onClick={handleResumeFromReport}
                disabled={resumeIsLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                style={{
                  background: "#fafafa",
                  color: "#0a0a0a",
                }}
              >
                <FileText size={12} />
                {resumeIsLoading ? "…" : "Resume"}
              </button>
            ) : (
              <Link
                to="/generate"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: "#fafafa",
                  color: "#0a0a0a",
                }}
              >
                <FileText size={12} />
                Resume
              </Link>
            )}
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 px-5 py-7 max-w-3xl">
          <ActivePanel {...TAB_DATA[activeTab]} />
        </div>
      </main>

      {/* ── RIGHT SIDEBAR: Skill Gaps ── */}
      <GapsSidebar gaps={mappedGaps} />
    </div>
  );
}
