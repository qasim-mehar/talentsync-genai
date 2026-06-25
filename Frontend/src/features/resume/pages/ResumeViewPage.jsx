import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { PageLoader } from "../../../components/shared/PageLoader";
import { ScoreDelta } from "../components/ScoreDelta";
import { useResume } from "../hooks/useResume";
import { Download, ArrowLeft, ExternalLink } from "lucide-react";

// ─── ResumeViewPage ───────────────────────────────────────────────────────────
/**
 * Displays a previously saved resume by fetching its HTML from the API
 * and rendering it inside a sandboxed <iframe> using srcdoc.
 * Shows score delta, download button, and interview link in a sidebar.
 */
export function ResumeViewPage() {
  const { resumeId } = useParams();
  const { currentResume, resumeIsLoading, handleGetResumeById } = useResume();
  const iframeRef = useRef(null);

  useEffect(() => {
    if (resumeId && (!currentResume || currentResume._id !== resumeId)) {
      handleGetResumeById(resumeId);
    }
  }, [resumeId]);

  if (resumeIsLoading || !currentResume) {
    return <PageLoader message="Loading your resume…" />;
  }

  const before         = currentResume.overallScore?.before ?? 0;
  const after          = currentResume.overallScore?.after  ?? 0;
  const interviewId    = currentResume.interviewId?._id;
  const interviewTitle = currentResume.interviewId?.title || "Interview Report";
  const date           = new Date(currentResume.createdAt).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  function downloadPDF() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/resume/${resumeId}/download`;
  }

  return (
    <AppLayout showFooter={false} className="flex flex-col">
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Resume preview ── */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#111111" }}>
          {/* Toolbar */}
          <div
            className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid #1c1c1c", backgroundColor: "#0a0a0a" }}
          >
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: "#52525b" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
              onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
            >
              <ArrowLeft size={13} />
              Dashboard
            </Link>
            <span style={{ color: "#1c1c1c" }}>/</span>
            <span className="text-xs font-medium" style={{ color: "#71717a" }}>Resume Preview</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs" style={{ color: "#3f3f46" }}>{date}</span>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-black bg-white transition-all duration-150 hover:bg-zinc-200"
              >
                <Download size={12} />
                Download PDF
              </button>
            </div>
          </div>

          {/* iframe preview */}
          <div
            className="flex-1 overflow-auto p-6 flex justify-center"
            style={{ backgroundColor: "#111111" }}
          >
            <div
              className="shadow-2xl rounded-sm overflow-hidden"
              style={{ width: "210mm", minHeight: "297mm" }}
            >
              <iframe
                ref={iframeRef}
                title="Resume Preview"
                srcDoc={currentResume.htmlContent}
                sandbox="allow-same-origin"
                className="w-full border-0"
                style={{ height: "297mm" }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside
          className="w-72 flex-shrink-0 overflow-y-auto flex flex-col"
          style={{ borderLeft: "1px solid #1c1c1c", backgroundColor: "#0a0a0a" }}
        >
          <div className="p-5" style={{ borderBottom: "1px solid #1c1c1c" }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#3f3f46" }}>
              Quality Improvement
            </p>
            <ScoreDelta before={before} after={after} />
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#3f3f46" }}>
                Source Report
              </p>
              {interviewId ? (
                <Link
                  to={`/interview-report/${interviewId}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111", color: "#a1a1aa" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#262626"; e.currentTarget.style.color = "#fafafa"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1c1c"; e.currentTarget.style.color = "#a1a1aa"; }}
                >
                  <span className="truncate">{interviewTitle}</span>
                  <ExternalLink size={13} className="flex-shrink-0" style={{ color: "#3f3f46" }} />
                </Link>
              ) : (
                <p className="text-sm" style={{ color: "#3f3f46" }}>Not available</p>
              )}
            </div>

            <div className="rounded-xl p-4" style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#52525b" }}>About this resume</p>
              <ul className="space-y-1.5">
                {[
                  "Strong action verbs on every bullet",
                  "Metrics included or estimated (est.)",
                  "Single A4 page, ATS-ready",
                  "Skills normalised and grouped",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "#52525b" }}>
                    <span style={{ color: "#71717a" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
