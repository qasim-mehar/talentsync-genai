import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

// ─── AppLayout ────────────────────────────────────────────────────────────────
/**
 * Standard app layout wrapper used by all non-landing pages.
 * Renders: Navbar → <main> children → optional Footer
 *
 * @param {React.ReactNode} children
 * @param {boolean} showFooter - show footer (default true)
 * @param {string}  className  - extra classes for the <main> element
 */
export function AppLayout({ children, showFooter = true, className = "" }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />
      <main className={`flex-1 ${className}`}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
