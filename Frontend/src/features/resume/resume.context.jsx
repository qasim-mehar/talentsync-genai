import { createContext, useState } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
export const resumeContext = createContext();

// ─── Provider ─────────────────────────────────────────────────────────────────
/**
 * ResumeProvider holds all resume-related state.
 * Kept intentionally flat — no derived state, no logic.
 * Business logic lives in useResume hook (Layer 2).
 */
export function ResumeProvider({ children }) {
  // List of resume metadata objects (from GET /api/resume/)
  const [allResumes, setAllResumes] = useState([]);

  // The currently viewed full resume (HTML + scores)
  const [currentResume, setCurrentResume] = useState(null);

  // Shared loading flag for all resume operations
  const [resumeIsLoading, setResumeIsLoading] = useState(false);

  // Last generated resume ID (used to navigate after generation)
  const [lastGeneratedResumeId, setLastGeneratedResumeId] = useState(null);

  return (
    <resumeContext.Provider
      value={{
        allResumes,
        setAllResumes,
        currentResume,
        setCurrentResume,
        resumeIsLoading,
        setResumeIsLoading,
        lastGeneratedResumeId,
        setLastGeneratedResumeId,
      }}
    >
      {children}
    </resumeContext.Provider>
  );
}
