import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { PageLoader } from "../../../components/shared/PageLoader";
import { ErrorCard } from "../../../components/shared/ErrorCard";
import { ResumeUploader } from "../components/ResumeUploader";
import { JobDescriptionInput } from "../components/JobDescriptionInput";
import { SelfDescriptionInput } from "../components/SelfDescriptionInput";
import { useInterviewReport } from "../hooks/useInterviewReport";
import { useResume } from "../../resume/hooks/useResume";
import { useAuth } from "../../auth/hooks/useAuth";
import { toast } from "sonner";
import { Zap, Info, ArrowRight, FileText, Sparkles } from "lucide-react";

// ─── GeneratePage ─────────────────────────────────────────────────────────────
/**
 * Public page — accessible without login.
 * Users who aren't logged in see a soft nudge banner.
 * Supports two actions: Generate Report and Generate Resume (both with/without login).
 */
export function GeneratePage() {
  const { isLoading: reportLoading, handleGenrateInterviewReport } = useInterviewReport();
  const { resumeIsLoading, handleGenerateResumePublic } = useResume();
  const { userData } = useAuth();

  const [resumeFile, setResumeFile]           = useState(null);
  const [jobDescription, setJobDescription]   = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [reportError, setReportError]         = useState(null);
  const [resumeError, setResumeError]         = useState(null);

  const isLoading  = reportLoading || resumeIsLoading;

  const isFormValid =
    resumeFile !== null &&
    jobDescription.trim().length >= 20 &&
    selfDescription.trim().length > 0;

  // ── Generate Interview Report ──
  const handleGenerateReport = async () => {
    if (!isFormValid || isLoading) return;
    setReportError(null);
    setResumeError(null);
    try {
      await handleGenrateInterviewReport({ selfDescription, jobDescription, resumeFile });
      // Navigation handled inside hook — no toast needed here
    } catch (err) {
      const msg = err?.message || "Failed to generate report. Please try again.";
      setReportError(msg);
      toast.error("Report generation failed", { description: msg });
    }
  };

  // ── Generate Resume (public, no login required) ──
  const handleGenerateResume = async () => {
    if (!isFormValid || isLoading) return;
    setReportError(null);
    setResumeError(null);
    try {
      await handleGenerateResumePublic({ resumeFile, jobDescription, selfDescription });
      toast.success("Resume downloaded!", {
        description: userData
          ? "Your AI-rewritten resume has been downloaded and saved."
          : "Your AI-rewritten resume has been downloaded. Log in to save it.",
      });
    } catch (err) {
      const msg = err?.message || "Failed to generate resume. Please try again.";
      setResumeError(msg);
      toast.error("Resume generation failed", { description: msg });
    }
  };

  if (reportLoading) {
    return (
      <PageLoader message="Analyzing your profile — this takes about 30 seconds…" />
    );
  }
  if (resumeIsLoading) {
    return (
      <PageLoader message="AI is rewriting your resume — this takes about 20 seconds…" />
    );
  }

  return (
    <AppLayout showFooter={false} className="flex flex-col">
      <div className="flex-1 mx-auto w-full max-w-5xl px-5 py-10">

        {/* Page header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "#3f3f46" }}>
            AI Interview Prep
          </span>
          <h1 className="text-2xl font-bold text-white mt-2 mb-1">
            Generate Your Prep Kit
          </h1>
          <p className="text-sm" style={{ color: "#52525b" }}>
            Upload your resume and paste the job description to get your complete interview report <em style={{ color: "#71717a" }}>and</em> an AI-rewritten resume — no login required.
          </p>
        </div>




        {/* Auth nudge — for unauthenticated users */}
        {!userData && (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3.5"
            style={{
              border: "1px solid #262626",
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          >
            <Info size={15} className="mt-0.5 flex-shrink-0" style={{ color: "#52525b" }} />
            <p className="text-sm" style={{ color: "#71717a" }}>
              Your reports and resumes won't be saved without an account.{" "}
              <Link
                to="/login"
                className="font-semibold underline underline-offset-4 transition-colors"
                style={{ color: "#a1a1aa" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.color = "#a1a1aa"}
              >
                Log in or sign up free →
              </Link>
            </p>
          </div>
        )}

        {/* ── Error cards ── */}
        {reportError && (
          <ErrorCard
            title="Could not generate report"
            body={reportError}
            type="error"
            onDismiss={() => setReportError(null)}
          />
        )}
        {resumeError && (
          <ErrorCard
            title="Could not generate resume"
            body={resumeError}
            type="error"
            onDismiss={() => setResumeError(null)}
          />
        )}

        {/* Form card */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111" }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left — Resume upload */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#3f3f46" }}>
                Resume PDF
              </p>
              <ResumeUploader
                file={resumeFile}
                onFileChange={setResumeFile}
                disabled={isLoading}
              />
            </div>

            {/* Right — Descriptions */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#3f3f46" }}>
                  Job Description
                </p>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                  disabled={isLoading}
                />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#3f3f46" }}>
                  About You
                </p>
                <SelfDescriptionInput
                  value={selfDescription}
                  onChange={setSelfDescription}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7" style={{ borderTop: "1px solid #1c1c1c" }} />

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-4">
            {/* Primary row — both buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">

              {/* Generate Report button */}
              <button
                id="generate-report-btn"
                onClick={handleGenerateReport}
                disabled={!isFormValid || isLoading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-black bg-white transition-all duration-150 hover:bg-zinc-200 hover:translate-y-[-1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <Zap size={15} />
                Generate Report
                <ArrowRight size={15} />
              </button>

              {/* Separator */}
              <span className="text-xs font-medium" style={{ color: "#3f3f46" }}>or</span>

              {/* Generate Resume button — highlighted */}
              <button
                id="generate-resume-btn"
                onClick={handleGenerateResume}
                disabled={!isFormValid || isLoading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-black bg-white transition-all duration-150 hover:bg-zinc-200 hover:translate-y-[-1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                style={{
                  background: isFormValid && !isLoading ? "#fafafa" : "#262626",
                  color: isFormValid && !isLoading ? "#0a0a0a" : "#52525b",
                  border: isFormValid && !isLoading ? "1px solid #ffffff" : "1px solid #1c1c1c",
                  boxShadow: isFormValid && !isLoading ? "0 0 15px rgba(255,255,255,0.2)" : "none",
                }}
              >
                <FileText size={15} />
                Generate Resume PDF

              </button>
            </div>

            <p className="text-xs" style={{ color: "#3f3f46" }}>
              Analysis takes approximately 30 seconds • Resume generation ~20 seconds
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
