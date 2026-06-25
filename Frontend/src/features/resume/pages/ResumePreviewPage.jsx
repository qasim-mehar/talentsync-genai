import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { Download, ArrowLeft } from "lucide-react";

export function ResumePreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfBlobUrl = location.state?.pdfBlobUrl;
  const resumeId = location.state?.resumeId;

  useEffect(() => {
    if (!pdfBlobUrl) {
      navigate("/generate", { replace: true });
    }
  }, [pdfBlobUrl, navigate]);

  if (!pdfBlobUrl) return null;

  function handleDownload() {
    if (resumeId) {
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/resume/${resumeId}/download`;
    } else {
      // Fallback if resumeId somehow isn't available
      try {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = pdfBlobUrl;
        a.download = "talentsync_resume.pdf";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      } catch (err) {
        console.error("Download failed:", err);
      }
    }
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
              to={resumeId ? `/dashboard` : "/generate"}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: "#52525b" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
              onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
            >
              <ArrowLeft size={13} />
              Back
            </Link>
            <span style={{ color: "#1c1c1c" }}>/</span>
            <span className="text-xs font-medium" style={{ color: "#71717a" }}>
              {resumeId ? "Resume Preview" : "Resume Preview (Guest)"}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleDownload}
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
              style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#fff" }}
            >
              <iframe
                title="Resume Preview"
                src={pdfBlobUrl}
                className="w-full border-0 h-full"
                style={{ height: "100%", minHeight: "297mm" }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside
          className="w-72 flex-shrink-0 overflow-y-auto flex flex-col"
          style={{ borderLeft: "1px solid #1c1c1c", backgroundColor: "#0a0a0a" }}
        >
          <div className="p-5 space-y-4 mt-4">
            <div className="rounded-xl p-4" style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111" }}>
              <p className="text-xs font-semibold mb-2 text-white">Your resume is ready</p>
              <p className="text-xs mb-4" style={{ color: "#a1a1aa", lineHeight: "1.5" }}>
                {resumeId
                  ? "This is your AI-rewritten resume. It has been saved to your account and you can access it anytime from the dashboard."
                  : "This is a temporary preview of your AI-rewritten resume. Since you aren't logged in, it hasn't been saved to your account."}
              </p>
              {!resumeId && (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-black bg-white transition-all hover:bg-zinc-200"
                >
                  Log in to save future resumes
                </Link>
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
