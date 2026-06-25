import { Routes, Route, Navigate } from "react-router-dom";

// ── Pages ────────────────────────────────────────────────────────────────────
import { LandingPage }          from "./features/landing/pages/LandingPage";
import { LoginPage }            from "./features/auth/pages/LoginPage";
import { RegisterPage }         from "./features/auth/pages/RegisterPage";
import { GeneratePage }         from "./features/interview/pages/GeneratePage";
import { InterviewReportPage }  from "./features/interview/pages/InterviewReportPage";
import { ResumeViewPage }       from "./features/resume/pages/ResumeViewPage";
import { ResumePreviewPage }    from "./features/resume/pages/ResumePreviewPage";
import { DashboardPage }        from "./features/dashboard/pages/DashboardPage";

// ── Guards ───────────────────────────────────────────────────────────────────
import Protected from "./features/auth/components/Protected";

// ─── AppRoutes ────────────────────────────────────────────────────────────────
/**
 * Route map:
 *
 *  /                        → LandingPage          (public)
 *  /generate                → GeneratePage         (public — no login required)
 *  /interview-report/:id    → InterviewReportPage  (public)
 *  /resume/preview          → ResumePreviewPage    (public — guest preview)
 *  /resume/:resumeId        → ResumeViewPage       (public)
 *  /dashboard               → DashboardPage        (protected — login required)
 *  /login                   → LoginPage            (public)
 *  /register                → RegisterPage         (public)
 *  *                        → redirect /
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"                        element={<LandingPage />}         />
      <Route path="/generate"                element={<GeneratePage />}        />
      <Route path="/interview-report/:reportId" element={<InterviewReportPage />} />
      <Route path="/resume/preview"          element={<ResumePreviewPage />}   />
      <Route path="/resume/:resumeId"        element={<ResumeViewPage />}      />
      <Route path="/login"                   element={<LoginPage />}           />
      <Route path="/register"                element={<RegisterPage />}        />

      {/* ── Protected ── */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
