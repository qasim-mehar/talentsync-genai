import { Link } from "react-router-dom";

// ─── LandingFooter ──────────────────────────────────────────────────────────
/**
 * Minimal dark-mode footer for the landing page.
 */
export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #1c1c1c" }}>
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md"
            style={{ backgroundColor: "#fafafa" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="#0a0a0a" />
            </svg>
          </div>
          <span className="text-xs font-semibold" style={{ color: "#a1a1aa" }}>TalentSync</span>
          <span className="text-xs" style={{ color: "#3f3f46" }}>© {year}</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs" style={{ color: "#3f3f46" }}>
          <Link
            to="/generate"
            className="transition-colors duration-150"
            onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
            onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}
          >
            Generate
          </Link>
          <a
            href="#"
            className="transition-colors duration-150"
            onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
            onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}
          >
            Privacy
          </a>
          <a
            href="#"
            className="transition-colors duration-150"
            onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
            onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}
          >
            Terms
          </a>
        </div>

      </div>
    </footer>
  );
}
