import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { LayoutDashboard, LogOut, Menu, X, Zap } from "lucide-react";

// ─── LandingNavbar ──────────────────────────────────────────────────────────
/**
 * Dark-mode navigation bar for the landing page.
 * Transparent background that gains a subtle border on scroll.
 */
export function LandingNavbar() {
  const { userData, handleLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!userData;

  async function onLogout() {
    await handleLogout();
    navigate("/");
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #1c1c1c",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md transition-opacity group-hover:opacity-80"
            style={{ backgroundColor: "#fafafa" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"
                fill="#0a0a0a"
              />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            TalentSync
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/generate"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150"
            style={{ color: "#71717a" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fafafa"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <Zap size={13} />
            Generate
          </Link>

          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150"
              style={{ color: "#71717a" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fafafa"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
          )}

          <div className="w-px h-4 mx-2" style={{ backgroundColor: "#27272a" }} />

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: "#52525b" }}>
                {userData?.userName}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150"
                style={{ color: "#71717a" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fafafa"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150"
                style={{ color: "#71717a" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fafafa"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                id="nav-signup-btn"
                className="px-4 py-1.5 rounded-md text-sm font-semibold bg-white text-black transition-all duration-150 hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 rounded-md transition-colors"
          style={{ color: "#71717a" }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          className="md:hidden px-5 py-3 space-y-1 ts-animate-fade-in"
          style={{ borderTop: "1px solid #1c1c1c", backgroundColor: "#0a0a0a" }}
        >
          <Link
            to="/generate"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
            style={{ color: "#71717a" }}
          >
            <Zap size={14} /> Generate
          </Link>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
              style={{ color: "#71717a" }}
            >
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          )}
          <div className="h-px my-2" style={{ backgroundColor: "#1c1c1c" }} />
          {isLoggedIn ? (
            <button
              onClick={() => { setMobileOpen(false); onLogout(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
              style={{ color: "#71717a" }}
            >
              <LogOut size={14} /> Sign out ({userData?.userName})
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium"
                style={{ color: "#71717a" }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-semibold text-center text-black bg-white"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
