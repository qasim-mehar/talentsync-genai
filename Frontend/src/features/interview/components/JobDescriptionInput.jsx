import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function JobDescriptionInput({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="job-description"
        className="text-sm font-semibold text-zinc-800 flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        Job Description
      </Label>
      <Textarea
        id="job-description"
        placeholder="Paste the full job description here…&#10;&#10;e.g. Role: Senior Project Manager&#10;Skills: Agile, Scrum, SQL…&#10;Responsibilities: Lead cross-functional teams…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[140px] bg-white text-sm leading-relaxed"
      />
      <p className="text-xs text-zinc-400">
        Include role title, required skills, and key responsibilities for best results.
      </p>
    </div>
  );
}
