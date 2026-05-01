import { useState } from "react";

/**
 * TechnicalQuestionsPanel — Displays a list of technical interview questions.
 * Each question is an expandable card with interviewer intention, sample answer, and difficulty tag.
 *
 * Expected question shape:
 * { id, question, sampleAnswer, interviewerIntention, difficulty: "Easy" | "Medium" | "Hard" }
 */

const DIFFICULTY_STYLES = {
  Easy: "bg-zinc-100 text-zinc-500 border-zinc-200",
  Medium: "bg-zinc-200 text-zinc-600 border-zinc-300",
  Hard: "bg-zinc-900 text-white border-zinc-900",
};

export function TechnicalQuestionsPanel({ questions = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Technical Questions
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Prepare for these role-specific technical questions
          </p>
        </div>
        <span className="text-xs font-medium text-zinc-400 bg-zinc-100 rounded-full px-3 py-1">
          {questions.length} questions
        </span>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center">
          <p className="text-sm text-zinc-400">No technical questions generated yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q, index) => {
            const isExpanded = expandedId === q.id;
            const diffStyle = DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES.Medium;

            return (
              <div
                key={q.id}
                className={`
                  rounded-xl border transition-all duration-200
                  ${isExpanded ? "border-zinc-300 shadow-sm" : "border-zinc-200 hover:border-zinc-300"}
                `}
              >
                {/* Question header */}
                <button
                  onClick={() => toggle(q.id)}
                  className="flex items-start gap-3 w-full text-left px-4 py-4"
                >
                  {/* Number badge */}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-500 mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {/* Difficulty + Chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-semibold rounded-full border px-2.5 py-0.5 ${diffStyle}`}>
                      {q.difficulty}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-zinc-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {/* Expandable answer */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 px-4 py-4 bg-zinc-50/50 rounded-b-xl space-y-4">
                    {/* Interviewer Intention */}
                    {q.interviewerIntention && (
                      <div className="flex gap-2.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-200/70 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Interviewer Intention</p>
                          <p className="text-sm text-zinc-500 leading-relaxed">{q.interviewerIntention}</p>
                        </div>
                      </div>
                    )}
                    {/* Sample Answer */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Sample Answer</p>
                      <p className="text-sm text-zinc-600 leading-relaxed">{q.sampleAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
