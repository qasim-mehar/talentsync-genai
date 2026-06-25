import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function JobDescriptionInput({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="job-description"
        className="text-sm font-semibold flex items-center gap-2"
        style={{ color: "#a1a1aa" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        Job Description
      </Label>
      <Textarea
        id="job-description"
        placeholder={"Paste the full job description here…\n\ne.g. Role: Senior Project Manager\nSkills: Agile, Scrum, SQL…\nResponsibilities: Lead cross-functional teams…"}
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
        Include role title, required skills, and key responsibilities for best results.
      </p>
    </div>
  );
}
