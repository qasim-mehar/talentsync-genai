import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, BrainCircuit, FileText, Target, Map, CheckCircle2,
  ArrowRight, MessageSquare, BarChart3, Sparkles,
  Shield, Clock, ChevronRight,
} from "lucide-react";
import { LandingNavbar } from "../components/LandingNavbar";
import { LandingFooter } from "../components/LandingFooter";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BarChart3,
    title: "Match Score",
    body: "See exactly where you stand before the interview. 0–100 alignment score based on resume-to-JD fit.",
  },
  {
    icon: BrainCircuit,
    title: "Technical Questions",
    body: "5–8 questions your interviewer will actually ask, with full model answers and reasoning behind each.",
  },
  {
    icon: MessageSquare,
    title: "Behavioral Coaching",
    body: "STAR-format model answers for every soft-skill question, tagged by trait category.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    body: "Precise skills you're missing versus the JD, each rated low / medium / high severity.",
  },
  {
    icon: Map,
    title: "7-Day Roadmap",
    body: "Day-by-day study tasks calibrated to your specific gaps. No generic advice — ever.",
  },
  {
    icon: FileText,
    title: "Resume Rewrite",
    body: "One A4 page, ATS-ready, strong action verbs, metrics on every bullet — generated from your data.",
  },
];

const STEPS = [
  {
    number: "01",
    icon: FileText,
    title: "Upload your resume",
    body: "Drop your PDF resume. We extract the full text and benchmark your experience against the target role.",
  },
  {
    number: "02",
    icon: Target,
    title: "Paste the job description",
    body: "Add the job posting and a brief self-intro. The AI personalises every question, gap, and roadmap task.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Get your complete prep kit",
    body: "Tailored questions, skill gaps, study roadmap, and an AI-rewritten resume — all in under 30 seconds.",
  },
];

const RULES = [
  'Strong action verbs only — banned: "helped", "assisted", "was responsible for"',
  "Metrics on every bullet — real numbers, or conservative estimates labelled (est.)",
  "Achievement formula: Verb + What + Tool/Tech + Quantified Result",
  "Soft skills shown as evidence, never as adjectives",
  "Single A4 page that passes ATS scanners",
];

const STATS = [
  { value: "30s", label: "Average turnaround" },
  { value: "6", label: "Outputs per run" },
  { value: "100", label: "Max match score" },
  { value: "0", label: "Account required" },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED SVG — Hero left panel
// ─────────────────────────────────────────────────────────────────────────────
function HeroSVG() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Outer slow-spin ring */}
      <svg
        viewBox="0 0 400 400"
        className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
        style={{ overflow: "visible" }}
      >
        {/* Outer ring */}
        <circle
          cx="200" cy="200" r="178"
          fill="none" stroke="#27272a" strokeWidth="1"
          style={{ animation: "ts-spin-slow 40s linear infinite", transformOrigin: "200px 200px" }}
        />
        {/* Mid ring dashed */}
        <circle
          cx="200" cy="200" r="130"
          fill="none" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 8"
          style={{ animation: "ts-spin-slow 28s linear infinite reverse", transformOrigin: "200px 200px" }}
        />
        {/* Inner ring */}
        <circle
          cx="200" cy="200" r="80"
          fill="none" stroke="#27272a" strokeWidth="1"
          style={{ animation: "ts-spin-slow 18s linear infinite", transformOrigin: "200px 200px" }}
        />

        {/* Central hexagon glyph */}
        <polygon
          points="200,168 226,183 226,213 200,228 174,213 174,183"
          fill="none" stroke="#52525b" strokeWidth="1.5"
        />
        <polygon
          points="200,178 216,187 216,205 200,214 184,205 184,187"
          fill="#18181b" stroke="#3f3f46" strokeWidth="1"
        />
        {/* Center dot */}
        <circle cx="200" cy="196" r="6" fill="#fafafa" opacity="0.9" />
        <circle cx="200" cy="196" r="3" fill="#0a0a0a" />

        {/* Connection lines to ring nodes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + 80 * Math.cos(rad);
          const y1 = 200 + 80 * Math.sin(rad);
          const x2 = 200 + 130 * Math.cos(rad);
          const y2 = 200 + 130 * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#27272a" strokeWidth="1" />
          );
        })}

        {/* Mid-ring node dots */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + 130 * Math.cos(rad);
          const y = 200 + 130 * Math.sin(rad);
          return (
            <circle key={i} cx={x} cy={y} r="4"
              fill="#27272a" stroke="#52525b" strokeWidth="1"
              style={{
                animation: `ts-pulse-dot 3s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          );
        })}

        {/* Outer node dots */}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + 178 * Math.cos(rad);
          const y = 200 + 178 * Math.sin(rad);
          return (
            <circle key={i} cx={x} cy={y} r="2.5"
              fill="#3f3f46" />
          );
        })}
      </svg>

      {/* Orbiting white dot */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-white/70"
        style={{
          animation: "ts-orbit-hero 8s linear infinite",
          transformOrigin: "center",
        }}
      />
      {/* Orbiting dim dot — opposite phase */}
      <div
        className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
        style={{
          animation: "ts-orbit-hero 12s linear infinite reverse",
          transformOrigin: "center",
        }}
      />

      {/* Floating stat chips */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white/70"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
        Match score: 86/100
      </div>
      <div
        className="absolute bottom-8 left-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white/70"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <CheckCircle2 size={11} className="text-white/50" />
        Resume rewritten
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL REVEAL HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const [featRef, featVisible] = useScrollReveal();
  const [stepsRef, stepsVisible] = useScrollReveal();
  const [resumeRef, resumeVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0a0a", color: "#fafafa" }}>
      <LandingNavbar />

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section
        className="relative flex items-center min-h-screen overflow-hidden border-b"
        style={{ borderColor: "#262626" }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 ts-grid-bg opacity-100 pointer-events-none" />

        {/* Soft radial bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 55% 45% at 30% 50%, rgba(255,255,255,0.025) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 w-full py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* LEFT — animated SVG */}
            <div className="flex-1 flex items-center justify-center order-2 lg:order-1 min-h-[320px]">
              <HeroSVG />
            </div>

            {/* RIGHT — copy */}
            <div className="flex-1 flex flex-col gap-6 order-1 lg:order-2">
              {/* Eyebrow */}
              <span
                className="ts-animate-fade-up text-xs uppercase tracking-widest font-medium"
                style={{ color: "#52525b" }}
              >
                AI-Powered Interview Intelligence
              </span>

              {/* Headline */}
              <h1
                className="ts-animate-fade-up ts-delay-1 font-black tracking-tight text-white leading-[1.05]"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
              >
                Stop losing to ATS.
<span style={{ color: "#a1a1aa" }}> Start matching.</span>
              </h1>

              {/* Sub-headline */}
              <p
                className="ts-animate-fade-up ts-delay-2 text-lg leading-relaxed max-w-md"
                style={{ color: "#71717a" }}
              >
               Transform your resume into an ATS powerhouse  optimized keywords, proven
              formatting, and an impact score that shows how recruiters will see it. Upload
              your resume and job description to get an <strong className="font-semibold text-zinc-300">  AI-engineered resume built for ATS systems</strong>, plus a detailed audit
              showing exactly what moves the needle. Interview prep included no login required.
                            </p>

              {/* CTA group */}
              <div className="ts-animate-fade-up ts-delay-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  id="hero-cta-primary"
                  to="/generate"
                  className="flex items-center justify-center gap-2 px-7 py-3 rounded-md text-sm font-semibold bg-white text-black transition-all duration-150 hover:bg-zinc-200 hover:translate-y-[-2px]"
                >
                  Build ATS Resume
                  <ArrowRight size={15} />
                </Link>
                <a
                  href="#how-it-works"
                  id="hero-cta-secondary"
                  className="flex items-center justify-center gap-1.5 px-7 py-3 rounded-md text-sm font-medium transition-all duration-150 hover:bg-white/5"
                  style={{ color: "#71717a", border: "1px solid #262626" }}
                >
                  See how it works
                  <ChevronRight size={14} />
                </a>
              </div>

              {/* Trust strip */}
              <div
                className="ts-animate-fade-up ts-delay-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-4 text-xs"
                style={{ color: "#3f3f46" }}
              >
                {["No account required", "Takes ~30 seconds", "Powered by Gemini 2.5 Flash"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span>·</span>}
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="border-b"
        style={{ borderColor: "#262626", backgroundColor: "#111111" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="text-center"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                }}
              >
                <p className="text-4xl font-black text-white tracking-tight">{stat.value}</p>
                <p className="text-xs mt-1.5 uppercase tracking-widest" style={{ color: "#52525b" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════════ */}
      <section
        id="features"
        ref={featRef}
        className="py-24 border-b"
        style={{ borderColor: "#262626", backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="mb-16 max-w-xl">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "#52525b" }}>
              What you get
            </span>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mt-3 tracking-tight"
            >
              Everything you need to walk in prepared.
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "#71717a" }}>
              One tool. Six outputs. Zero guesswork.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-xl group cursor-default"
                  style={{
                    border: "1px solid #1c1c1c",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    transition: "border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease",
                    opacity: featVisible ? 1 : 0,
                    transform: featVisible ? "translateY(0)" : "translateY(24px)",
                    transitionDelay: `${i * 0.07}s`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#3f3f46";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#1c1c1c";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                    style={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
                  >
                    <Icon size={18} style={{ color: "#a1a1aa" }} />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#71717a" }}>{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={stepsRef}
        className="py-24 border-b"
        style={{ borderColor: "#262626", backgroundColor: "#111111" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "#52525b" }}>
              The Process
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3 tracking-tight">
              Three inputs. One complete kit.
            </h2>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative p-7 rounded-xl"
                  style={{
                    border: "1px solid #1c1c1c",
                    backgroundColor: "#0a0a0a",
                    opacity: stepsVisible ? 1 : 0,
                    transform: stepsVisible ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                  }}
                >
                  {/* Step number */}
                  <span
                    className="absolute top-6 right-6 text-xs font-mono font-bold"
                    style={{ color: "#27272a" }}
                  >
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: "#18181b", border: "1px solid #262626" }}
                  >
                    <Icon size={20} style={{ color: "#a1a1aa" }} />
                  </div>

                  <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#71717a" }}>{step.body}</p>

                  {/* Connector arrow on desktop */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#18181b", border: "1px solid #262626" }}
                    >
                      <ArrowRight size={13} style={{ color: "#52525b" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RESUME REWRITE SHOWCASE
      ══════════════════════════════════════════════ */}
      <section
        ref={resumeRef}
        className="py-24 border-b"
        style={{ borderColor: "#262626", backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* Left — rules */}
            <div
              style={{
                opacity: resumeVisible ? 1 : 0,
                transform: resumeVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "#52525b" }}>
                Resume Rewrite
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3 mb-8 tracking-tight leading-tight">
                Your resume. Rewritten by intelligence that's read 10,000.
              </h2>
              <ul className="space-y-4">
                {RULES.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: "#a1a1aa" }}
                    />
                    <span className="text-sm leading-relaxed" style={{ color: "#71717a" }}>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — before / after */}
            <div
              className="space-y-4"
              style={{
                opacity: resumeVisible ? 1 : 0,
                transform: resumeVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
              }}
            >
              {/* BEFORE */}
              <div
                className="rounded-xl p-5"
                style={{ border: "1px solid #27272a", backgroundColor: "#111111" }}
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#52525b" }}
                >
                  ✕ Before
                </span>
                <p className="mt-3 text-sm font-mono leading-relaxed" style={{ color: "#52525b" }}>
                  "Worked on a React app for the company's internal use."
                </p>
              </div>

              {/* AFTER */}
              <div
                className="rounded-xl p-5"
                style={{
                  border: "1px solid #27272a",
                  borderLeft: "3px solid #fafafa",
                  backgroundColor: "#111111",
                }}
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#a1a1aa" }}
                >
                  ✓ After
                </span>
                <p className="mt-3 text-sm font-mono leading-relaxed" style={{ color: "#d4d4d8" }}>
                  "Engineered a React.js internal dashboard using Redux Toolkit and REST APIs,
                  reducing manual data entry time by ~65% (est.) for 120+ employees
                  and cutting support tickets by 40 per week."
                </p>
              </div>

              {/* Score delta */}
              <div
                className="flex items-center gap-3 rounded-xl px-5 py-4"
                style={{ border: "1px solid #1c1c1c", backgroundColor: "#111111" }}
              >
                <div className="text-center">
                  <p className="text-xs" style={{ color: "#52525b" }}>Before</p>
                  <p className="text-2xl font-black mt-0.5" style={{ color: "#3f3f46" }}>34</p>
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: "#262626" }} />
                <div className="text-center px-2">
                  <p className="text-sm font-bold text-white">+52 pts</p>
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: "#262626" }} />
                <div className="text-center">
                  <p className="text-xs" style={{ color: "#a1a1aa" }}>After</p>
                  <p className="text-2xl font-black mt-0.5 text-white">86</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA BLOCK
      ══════════════════════════════════════════════ */}
      <section
        className="relative py-28 overflow-hidden border-b"
        style={{ borderColor: "#262626", backgroundColor: "#111111" }}
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 ts-grid-bg opacity-40 pointer-events-none" />
        {/* Bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "#52525b" }}>
            Get Started
          </span>
          <h2
            className="font-black text-white tracking-tight leading-tight mt-4 mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}
          >
            Ready to walk into your next<br />interview prepared?
          </h2>
          <p className="text-base mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: "#52525b" }}>
            No account needed. Paste a job description, upload your resume, get your kit.
          </p>
          <Link
            id="cta-banner-primary"
            to="/generate"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md text-sm font-semibold bg-white text-black transition-all duration-150 hover:bg-zinc-200 hover:translate-y-[-2px]"
          >
            Analyze My Resume
            <ArrowRight size={15} />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "#27272a" }}>
            No account required · Takes ~30 seconds
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
