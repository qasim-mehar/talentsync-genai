import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import Protected from "./features/auth/components/Protected";

export function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to login for now */}
      <Route path="/" element={<Protected>{<h1>Homepage</h1>}</Protected>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
