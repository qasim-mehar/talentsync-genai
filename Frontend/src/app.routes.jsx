import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { HomePage } from "./features/interview/pages/HomePage";
import { InterviewReportPage } from "./features/interview/pages/InterviewReportPage";
import Protected from "./features/auth/components/Protected";

export function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to login for now */}
      
      <Route path="/" element={<Protected><HomePage /></Protected>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/interview-report/:reportId" element={<InterviewReportPage />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

