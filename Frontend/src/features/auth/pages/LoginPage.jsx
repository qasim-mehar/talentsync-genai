import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";

// ─── LoginPage ────────────────────────────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate();
  const { isLoading, handleLogin } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleLogin({ email, password });
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your reports and resumes"
      bottomText="Don't have an account?"
      bottomLinkText="Create one free"
      bottomLinkTo="/register"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Error banner */}
        {error && (
          <div
            className="rounded-lg px-3 py-2.5 text-sm"
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium" style={{ color: "#a1a1aa" }}>
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="h-10 text-sm"
            style={{
              backgroundColor: "#111111",
              borderColor: "#262626",
              color: "#fafafa",
            }}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Password
            </Label>
            <a
              href="#"
              className="text-xs font-medium transition-colors"
              style={{ color: "#52525b" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
              onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="h-10 text-sm"
            style={{
              backgroundColor: "#111111",
              borderColor: "#262626",
              color: "#fafafa",
            }}
          />
        </div>

        <button
          type="submit"
          id="login-submit-btn"
          disabled={isLoading}
          className="w-full h-10 text-sm font-semibold rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#fafafa", color: "#0a0a0a" }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = "#e4e4e7"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fafafa"; }}
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
