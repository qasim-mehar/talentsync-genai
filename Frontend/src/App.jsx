import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";

// ── Context Providers ─────────────────────────────────────────────────────────
import { AuthProvider }            from "./features/auth/auth.context.jsx";
import { InterviewReportProvider } from "./features/interview/interviewReport.context.jsx";
import { ResumeProvider }          from "./features/resume/resume.context.jsx";
import { Toaster }                 from "sonner";

// ─── App ──────────────────────────────────────────────────────────────────────
/**
 * Root component.
 * Provider nesting order (outermost → innermost):
 *   BrowserRouter → ToastProvider → AuthProvider → InterviewReportProvider → ResumeProvider
 *
 * ToastProvider is at the root so any component in the tree can fire toasts.
 * Auth is next because all other providers and pages may read auth state.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" theme="dark" />
      <AuthProvider>
        <InterviewReportProvider>
          <ResumeProvider>
            <AppRoutes />
          </ResumeProvider>
        </InterviewReportProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
