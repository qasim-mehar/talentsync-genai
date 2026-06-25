import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SelfDescriptionInput({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="self-description"
        className="text-sm font-semibold flex items-center gap-2"
        style={{ color: "#a1a1aa" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Self Description
      </Label>
      <Textarea
        id="self-description"
        placeholder={"Tell us about yourself…\n\ne.g. I'm a software engineer with 4 years of experience in full-stack development. Proficient in React, Node.js, and cloud technologies…"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[140px] text-sm leading-relaxed resize-none"
        style={{
          backgroundColor: "#0a0a0a",
          borderColor: "#262626",
          color: "#d4d4d8",
        }}
      />
      <p className="text-xs" style={{ color: "#3f3f46" }}>
        Highlight your experience, achievements, and why you're a great fit.
      </p>
    </div>
  );
}
