import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

// ─── AuthLayout ───────────────────────────────────────────────────────────────
/**
 * Split-screen auth layout.
 * LEFT: dark brand panel with feature list
 * RIGHT: dark form area
 *
 * @param {React.ReactNode} children     - the form
 * @param {string}          title        - form heading
 * @param {string}          subtitle     - form sub-heading
 * @param {string}          bottomText   - footer text before link
 * @param {string}          bottomLinkText
 * @param {string}          bottomLinkTo
 */
export function AuthLayout({
  children,
  title,
  subtitle,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
}) {
  const features = [
    "AI-generated interview questions with model answers",
    "Skill gap analysis and severity scoring",
    "7-day day-by-day preparation roadmap",
    "One-page ATS-optimised resume rewrite",
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0a" }}>
      {/* ── LEFT: Brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] p-12"
        style={{ backgroundColor: "#111111", borderRight: "1px solid #1c1c1c" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-opacity group-hover:opacity-80"
            style={{ backgroundColor: "#fafafa" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="#0a0a0a" />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-white">TalentSync</span>
        </Link>

        {/* Brand copy */}
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#3f3f46" }}>
              What you get
            </p>
            <ul className="space-y-3.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "#a1a1aa" }}
                  />
                  <span className="text-sm leading-snug" style={{ color: "#71717a" }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="border-l-2 pl-4" style={{ borderColor: "#262626" }}>
            <p className="text-sm italic leading-relaxed" style={{ color: "#3f3f46" }}>
              "Walk into every interview knowing exactly what they'll ask and
              exactly how to answer it."
            </p>
          </blockquote>
        </div>

        {/* Bottom label */}
        <p className="text-xs" style={{ color: "#27272a" }}>
          Powered by Gemini 2.5 Flash · {new Date().getFullYear()}
        </p>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ backgroundColor: "#fafafa" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="#0a0a0a" />
            </svg>
          </div>
          <span className="font-bold text-white">TalentSync</span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm" style={{ color: "#71717a" }}>{subtitle}</p>
            )}
          </div>

          {/* Form slot */}
          <div>{children}</div>

          {/* Bottom link */}
          {bottomText && bottomLinkText && bottomLinkTo && (
            <p className="text-center text-sm" style={{ color: "#52525b" }}>
              {bottomText}{" "}
              <Link
                to={bottomLinkTo}
                className="font-semibold underline underline-offset-4 transition-colors"
                style={{ color: "#a1a1aa" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.color = "#a1a1aa"}
              >
                {bottomLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
