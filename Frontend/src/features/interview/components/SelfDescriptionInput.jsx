import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SelfDescriptionInput({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="self-description"
        className="text-sm font-semibold text-zinc-800 flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Self Description
      </Label>
      <Textarea
        id="self-description"
        placeholder="Tell us about yourself…&#10;&#10;e.g. I'm a software engineer with 4 years of experience in full-stack development. Proficient in React, Node.js, and cloud technologies…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[140px] bg-white text-sm leading-relaxed"
      />
      <p className="text-xs text-zinc-400">
        Highlight your experience, achievements, and why you're a great fit.
      </p>
    </div>
  );
}
