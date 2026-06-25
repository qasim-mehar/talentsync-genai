import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";

// ─── RegisterPage ─────────────────────────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate();
  const { isLoading, handleRegister } = useAuth();

  const [userName, setUserName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleRegister({ userName, email, password });
      navigate("/generate");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const inputStyle = {
    backgroundColor: "#111111",
    borderColor: "#262626",
    color: "#fafafa",
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start analyzing resumes and preparing for interviews"
      bottomText="Already have an account?"
      bottomLinkText="Sign in"
      bottomLinkTo="/login"
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
          <Label htmlFor="userName" className="text-sm font-medium" style={{ color: "#a1a1aa" }}>
            Username
          </Label>
          <Input
            id="userName"
            type="text"
            placeholder="johndoe"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="username"
            required
            className="h-10 text-sm"
            style={inputStyle}
          />
        </div>

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
            style={inputStyle}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium" style={{ color: "#a1a1aa" }}>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
            className="h-10 text-sm"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          id="register-submit-btn"
          disabled={isLoading}
          className="w-full h-10 text-sm font-semibold rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#fafafa", color: "#0a0a0a" }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = "#e4e4e7"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fafafa"; }}
        >
          {isLoading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-xs" style={{ color: "#3f3f46" }}>
          By signing up you agree to our{" "}
          <a href="#" className="underline" style={{ color: "#52525b" }}>Terms</a> and{" "}
          <a href="#" className="underline" style={{ color: "#52525b" }}>Privacy Policy</a>.
        </p>
      </form>
    </AuthLayout>
  );
}
