import { useState } from "react";

/**
 * BehavioralQuestionsPanel — Displays behavioral interview questions with STAR framework hints.
 *
 * Expected question shape:
 * { id, question, sampleAnswer, interviewerIntention, category: string }
 */

export function BehavioralQuestionsPanel({ questions = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Behavioral Questions</h2>
          <p className="text-sm mt-0.5" style={{ color: "#52525b" }}>
            Practice your responses using the STAR method
          </p>
        </div>
        <span
          className="text-xs font-medium rounded-full px-3 py-1"
          style={{ color: "#52525b", backgroundColor: "#18181b", border: "1px solid #27272a" }}
        >
          {questions.length} questions
        </span>
      </div>

      {/* STAR reminder */}
      <div
        className="rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111" }}
      >
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5"
          style={{ backgroundColor: "#18181b" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: "#71717a" }}>STAR Framework</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#3f3f46" }}>
            <span className="font-semibold" style={{ color: "#52525b" }}>S</span>ituation ·{" "}
            <span className="font-semibold" style={{ color: "#52525b" }}>T</span>ask ·{" "}
            <span className="font-semibold" style={{ color: "#52525b" }}>A</span>ction ·{" "}
            <span className="font-semibold" style={{ color: "#52525b" }}>R</span>esult
          </p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: "#1c1c1c" }}>
          <p className="text-sm" style={{ color: "#3f3f46" }}>No behavioral questions generated yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q, index) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="rounded-xl transition-all duration-200"
                style={{ border: `1px solid ${isExpanded ? "#3f3f46" : "#1c1c1c"}` }}
              >
                <button
                  onClick={() => toggle(q.id)}
                  className="flex items-start gap-3 w-full text-left px-4 py-4"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold mt-0.5"
                    style={{ backgroundColor: "#18181b", color: "#52525b" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-relaxed">{q.question}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[11px] font-semibold rounded-full border px-2.5 py-0.5"
                      style={{ color: "#71717a", backgroundColor: "#18181b", borderColor: "#27272a" }}
                    >
                      {q.category}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      style={{ color: "#3f3f46" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div
                    className="border-t px-4 py-4 rounded-b-xl space-y-4"
                    style={{ borderColor: "#1c1c1c", backgroundColor: "#111111" }}
                  >
                    {q.interviewerIntention && (
                      <div className="flex gap-2.5">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md mt-0.5"
                          style={{ backgroundColor: "#18181b" }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#3f3f46" }}>
                            Interviewer Intention
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#71717a" }}>
                            {q.interviewerIntention}
                          </p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#3f3f46" }}>
                        Sample Answer
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>{q.sampleAnswer}</p>
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
