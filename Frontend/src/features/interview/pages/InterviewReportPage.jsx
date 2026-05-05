import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GapsSidebar } from "../components/GapsSidebar";
import { ReportNavSidebar } from "../components/ReportNavSidebar";
import { TechnicalQuestionsPanel } from "../components/TechnicalQuestionsPanel";
import { BehavioralQuestionsPanel } from "../components/BehavioralQuestionsPanel";
import { RoadMapPanel } from "../components/RoadMapPanel";
import { useInterviewReport } from "../hooks/useInterviewReport";

const TAB_PANELS = {
  technical: TechnicalQuestionsPanel,
  behavioral: BehavioralQuestionsPanel,
  roadmap: RoadMapPanel,
};

export function InterviewReportPage() {
  const { reportId } = useParams();
  const [activeTab, setActiveTab] = useState("technical");
  const { isLoading, report, handleGetReportById } = useInterviewReport();

  useEffect(() => {
    if (reportId) {
      if (!report || report._id !== reportId) {
        handleGetReportById(reportId);
      }
    }
  }, [reportId]);

  if (isLoading || !report) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-zinc-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-zinc-500 font-medium tracking-wide">Loading report...</p>
        </div>
      </div>
    );
  }

  // Map Backend Data to UI Component Expectations
  const mappedTechnical = report.technicalQuestions?.map((q, i) => ({
    id: `t${i}`,
    question: q.question,
    sampleAnswer: q.answer,
    interviewerIntention: q.intention,
    difficulty: q.difficultyLevel,
  })) || [];

  const mappedBehavioral = report.behavioralQuestions?.map((q, i) => ({
    id: `b${i}`,
    question: q.question,
    sampleAnswer: q.answer,
    interviewerIntention: q.intention,
    category: q.category,
  })) || [];

  const mappedRoadmap = report.preparationPlan?.map((plan, i) => ({
    id: `r${i}`,
    title: plan.focus,
    description: plan.tasks?.join(" • ") || "",
    duration: `Day ${plan.day}`,
    status: "upcoming", // Could be dynamic if we track progress
  })) || [];

  const mappedGaps = report.skillGaps?.map((gap, i) => ({
    id: `g${i}`,
    title: gap.skill,
    severity: gap.severity,
  })) || [];

  const TAB_DATA = {
    technical: { questions: mappedTechnical },
    behavioral: { questions: mappedBehavioral },
    roadmap: { steps: mappedRoadmap },
  };

  const ActivePanel = TAB_PANELS[activeTab];
  const panelProps = TAB_DATA[activeTab];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar: Navigation */}
      <ReportNavSidebar activeTab={activeTab} onTabChange={setActiveTab} matchScore={report.matchScore} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/90 backdrop-blur-sm px-6 py-3.5">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 transition-transform group-hover:scale-105">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-900">TalentSync</span>
            </a>
            <span className="text-zinc-300">/</span>
            <span className="text-sm font-medium text-zinc-500">Interview Report</span>
            {reportId && (
              <>
                <span className="text-zinc-300">/</span>
                <span className="text-xs font-mono text-zinc-400">{reportId.slice(0, 8)}…</span>
              </>
            )}
          </div>
          <div className="lg:hidden">
            <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 outline-none focus:border-zinc-400">
              <option value="technical">Technical Questions</option>
              <option value="behavioral">Behavioral Questions</option>
              <option value="roadmap">Road Map</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-8 max-w-3xl">
          <ActivePanel {...panelProps} />
        </div>
      </main>

      {/* Right Sidebar: Gaps */}
      <GapsSidebar gaps={mappedGaps} />
    </div>
  );
}
