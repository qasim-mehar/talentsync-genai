import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResumeUploader } from "../components/ResumeUploader";
import { JobDescriptionInput } from "../components/JobDescriptionInput";
import { SelfDescriptionInput } from "../components/SelfDescriptionInput";

export function HomePage() {
  // ── Local UI state ──
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const isFormValid =
    resumeFile && jobDescription.trim().length > 0 && selfDescription.trim().length > 0;

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setIsGenerating(true);

    // TODO: Wire up to hook layer (useInterviewReport)
    // The hook will call the service layer which calls the API.
    // For now, simulate a delay for UI demonstration.
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      

      {/* ── Main Content ── */}
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-14">
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Interview Report
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-lg mx-auto leading-relaxed">
            Upload your resume, describe the role, and get AI-powered interview
            preparation insights in seconds.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column — Resume Upload */}
            <div>
              <ResumeUploader
                file={resumeFile}
                onFileChange={setResumeFile}
                disabled={isGenerating}
              />
            </div>

            {/* Right Column — Descriptions */}
            <div className="space-y-6">
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                disabled={isGenerating}
              />
              <SelfDescriptionInput
                value={selfDescription}
                onChange={setSelfDescription}
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-zinc-100" />

          {/* Generate Button */}
          <div className="flex flex-col items-center gap-3">
            <Button
              id="generate-report-btn"
              onClick={handleGenerate}
              disabled={!isFormValid || isGenerating}
              className="h-12 px-8 rounded-xl text-sm font-semibold tracking-wide gap-2 transition-all duration-200 hover:shadow-md disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Report…
                </>
              ) : (
                <>
                  GENERATE REPORT
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </Button>
            <p className="text-xs text-zinc-400">
              {isGenerating
                ? "Analysis in progress — approximately 30 seconds…"
                : "Analysis takes approximately 30 seconds"}
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between text-xs text-zinc-400">
          <span>TalentSync © {new Date().getFullYear()}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
