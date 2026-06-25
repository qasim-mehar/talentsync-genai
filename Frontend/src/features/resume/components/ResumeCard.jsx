import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { ScoreDelta } from "./ScoreDelta";

// ─── ResumeCard ───────────────────────────────────────────────────────────────
/**
 * Card shown in the dashboard Resumes tab.
 * @param {Object} resume  - GeneratedResume document from API
 */
export function ResumeCard({ resume }) {
  const interviewTitle = resume.interviewId?.title || "Interview Report";
  const before = resume.overallScore?.before ?? 0;
  const after  = resume.overallScore?.after  ?? 0;
  const date   = new Date(resume.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 cursor-default"
      style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#3f3f46"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1c1c1c"}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
          style={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
        >
          <FileText size={15} style={{ color: "#a1a1aa" }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{interviewTitle}</p>
          <p className="text-xs mt-0.5" style={{ color: "#3f3f46" }}>{date}</p>
        </div>
      </div>

      {/* Score delta */}
      <ScoreDelta before={before} after={after} />

      {/* Actions */}
      <Link
        to={`/resume/${resume._id}`}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-semibold text-black bg-white transition-all duration-150 hover:bg-zinc-200"
      >
        View Resume
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
