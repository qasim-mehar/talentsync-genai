import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewReportProvider } from "./features/interview/interviewReport.context.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InterviewReportProvider>
          <AppRoutes />
        </InterviewReportProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
