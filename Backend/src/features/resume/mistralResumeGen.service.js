const { Mistral } = require("@mistralai/mistralai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// ─────────────────────────────────────────────────────────────────────────────
// PDF GENERATION
// ─────────────────────────────────────────────────────────────────────────────
async function generatePDFFromHTML(resumeHTML) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(resumeHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ZOD SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
const ResumeOutputSchema = z.object({
  html: z.string().min(1),
  overallScore: z.object({
    before: z.number().min(0).max(100),
    after: z.number().min(0).max(100),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// SAME PROMPT
// ─────────────────────────────────────────────────────────────────────────────
function buildResumePrompt(resume, selfDescription, jobDescription) {
  return `You are an elite resume writer, ATS optimization expert, and career coach with 10+ years of experience placing candidates at top-tier tech companies. You have deep knowledge of applicant tracking systems, recruiter psychology, and what separates a resume that gets interviews from one that gets ignored.

Your SOLE output is a single, perfectly formatted JSON object. No explanation. No preamble. No markdown. Pure JSON only.

═══════════════════════════════════════════════════════
CANDIDATE DATA
═══════════════════════════════════════════════════════

Resume (raw):
${resume}

Self Description:
${selfDescription || "Not provided."}

Target Job Description:
${jobDescription}

═══════════════════════════════════════════════════════
STEP 1 — CONTENT REWRITE RULES
═══════════════════════════════════════════════════════

━━━ RULE 1: ACTION VERBS (mandatory on every bullet) ━━━

Every bullet MUST open with a strong, high-agency action verb.

BANNED verbs — NEVER use:
helped, worked on, assisted, was responsible for, participated in,
supported, contributed to, did, made, handled, tried, attempted,
built (max 1 use total), implemented (max 1 use total),
engineered (max 1 use total), designed (max 2 uses total)

APPROVED replacements:
Engineering/Dev  → Architected, Automated, Deployed, Integrated, Shipped,
                   Secured, Optimized, Refactored, Streamlined, Crafted, Delivered
AI / ML          → Orchestrated, Fine-tuned, Benchmarked, Prompted, Evaluated, Integrated
Leadership       → Spearheaded, Championed, Led, Directed, Owned, Drove
Impact           → Reduced, Increased, Eliminated, Scaled, Boosted, Accelerated

Rotation rule: No single verb may appear more than ONCE across the entire resume.

━━━ RULE 2: METRICS ON EVERY BULLET (non-negotiable) ━━━

Every bullet MUST contain at least ONE of:
- A hard number    → "12+ API endpoints"
- A percentage     → "~40% faster build time"
- A scale          → "500+ records"
- A time metric    → "under 3 seconds"

ESTIMATE PROTOCOL — if candidate did not provide a metric:
- Use realistic, conservative industry-standard estimates
- Always append (est.) to any estimated figure
- Valid patterns: "~80% reduction (est.)", "500+ users (est.)", "3x faster (est.)"

ZERO metric-free bullets permitted. If you write one, you have failed.

━━━ RULE 3: ACHIEVEMENT FORMULA (every bullet) ━━━

Structure: [Strong Verb] + [What you did] + [Technology used] + [Quantified outcome]

❌ BAD:  "Built a login system with JWT."
✅ GOOD: "Secured the full MERN stack with JWT authentication and stateless session
          management, enforcing route-level access control across 12+ API endpoints
          and achieving zero unauthorized access incidents in testing."

━━━ RULE 4: BULLET FORMAT — bold category prefix ━━━

Every bullet MUST follow this exact format:
• [Bold Category Label]: [Achievement sentence with metric]

Examples:
• AI Integration: Designed and deployed an end-to-end Google Gemini AI pipeline...
• Security: Secured the full MERN stack with JWT authentication...
• Performance: Optimised build pipeline with Vite, achieving ~35% leaner bundle...

The bold label names the skill domain. It must be 1-3 words maximum.

━━━ RULE 5: HARD SKILLS ━━━
- Only use skills explicitly present in the candidate's raw data — never invent
- Normalize: "mongo" → "MongoDB", "js" → "JavaScript", "node" → "Node.js"
- Cross-reference job description — list matching skills first
- Group exactly as:
  • Languages & Web: ...
  • Frontend: ...
  • Backend: ...
  • Databases: ...
  • AI / Integrations: ...
  • Tools & Workflow: ...
- Maximum 20 skills total

━━━ RULE 6: SOFT SKILLS — SHOW DON'T TELL ━━━
Never list "team player", "good communicator" as standalone bullet items.
Embed evidence inside achievement bullets instead.
List soft skills as a single comma-separated line under Additional:
Soft Skills: Ownership Mindset, Independent Problem-Solving, Cross-Functional Communication, Attention to Detail

━━━ RULE 7: SUMMARY SECTION ━━━
- Exactly 3 sentences
- Sentence 1: Who you are + what you build (include "Aspiring" if intern-level)
- Sentence 2: Core technical strengths + AI/GenAI angle
- Sentence 3: Value you bring + career direction
- Must contain at least 3 ATS keywords from the job description
- Zero personal pronouns (no I, my, we)

═══════════════════════════════════════════════════════
STEP 2 — HTML OUTPUT RULES
═══════════════════════════════════════════════════════

CRITICAL: Resume MUST fit on exactly ONE A4 page (210mm × 297mm).
If it overflows, shorten bullets. This is a hard requirement.

━━━ DESIGN LANGUAGE ━━━
Replicate this exact visual style:
- Black and white only — no color accents, no sidebar, no chips
- Clean single-column layout with generous but tight spacing
- Section headings: bold, uppercase, full-width bottom border (1px solid black)
- All body text: serif or sans-serif, 10pt, color #1a1a2e
- Name: centered, ~20pt, bold, all caps
- Tagline: centered, ~10pt, normal weight, directly under name
- Contact row: centered, pipe-separated, ~9pt
- No colored chips, no sidebar background, no accent colors

━━━ LAYOUT STRUCTURE ━━━

┌─────────────────────────────────────────────────────────┐
│  NAME (centered, large, bold, all caps)                 │
│  Tagline (centered, italic)                             │
│  email | phone | linkedin | github (centered, pipes)   │
├─────────────────────────────────────────────────────────┤
│  SUMMARY                                                │
│  [3 sentence paragraph, left-aligned]                   │
├─────────────────────────────────────────────────────────┤
│  PROJECTS                                               │
│  Project Title — Description          repo link        │
│  Tech stack (italic, smaller)                          │
│  • Bold Label: bullet with metric                      │
│  • Bold Label: bullet with metric                      │
├─────────────────────────────────────────────────────────┤
│  RELEVANT EXPERIENCE (if provided)                      │
│  Organization Name               City, Country         │
│  Role Title                      Date — Date           │
│  • Bold Label: bullet with metric                      │
├─────────────────────────────────────────────────────────┤
│  ADDITIONAL                                             │
│  Technical Skills: (grouped, inline, comma-separated)  │
│  Soft Skills: (comma-separated line)                   │
│  Interests: (comma-separated line)                     │
│  Languages: (comma-separated line)                     │
├─────────────────────────────────────────────────────────┤
│  EDUCATION                                              │
│  UNIVERSITY NAME               City, Country           │
│  Degree — CGPA: X.X / 4.0     Year — Year             │
├─────────────────────────────────────────────────────────┤
│  HONORS, AWARDS & CERTIFICATIONS                        │
│  • Course Name — Platform · Instructor    link         │
└─────────────────────────────────────────────────────────┘

━━━ PROJECT HEADER FORMAT ━━━
Replicate exactly:
- Project title bold, left-aligned
- Em dash then short description, same line
- Repo link right-aligned on same line (plain text, underlined)
- Demo link right-aligned if available, same line as repo or below
- Tech stack on next line: italic, comma-separated, smaller font
- Then bullets with bold category prefix

HTML pattern for project header:
<div style="display:flex;justify-content:space-between;align-items:baseline;">
  <span style="font-weight:700;">Project Title — Short Description</span>
  <span style="font-size:8.5pt;"><a href="repourl" style="color:#1a1a2e;">repo.link</a> | <a href="demolink" style="color:#1a1a2e;">live demo</a></span>
</div>
<div style="font-style:italic;font-size:8.5pt;margin-bottom:3px;">React, Node.js, MongoDB, ...</div>

━━━ EDUCATION FORMAT ━━━
Replicate exactly:
- University name: bold, left-aligned, location right-aligned — same line
- Degree + CGPA: normal weight left, date range right — same line
No bullet points under education.

HTML pattern:
<div style="display:flex;justify-content:space-between;">
  <span style="font-weight:700;">UNIVERSITY NAME</span>
  <span>City, Country</span>
</div>
<div style="display:flex;justify-content:space-between;">
  <span style="font-style:italic;">Degree — CGPA: 3.5 / 4.0</span>
  <span style="font-style:italic;">2023 – Present</span>
</div>

━━━ SECTION HEADING FORMAT ━━━
HTML pattern:
<div style="font-weight:700;font-size:10pt;text-transform:uppercase;
border-bottom:1px solid #1a1a2e;padding-bottom:2px;margin:10px 0 5px;
letter-spacing:0.04em;">SECTION NAME</div>

━━━ BULLET FORMAT ━━━
HTML pattern:
<ul style="margin:0;padding-left:1.2em;list-style-type:disc;">
  <li style="font-size:8.5pt;line-height:1.4;margin-bottom:3px;">
    <strong>Category Label:</strong> Achievement sentence with metric.
  </li>
</ul>

━━━ MANDATORY HTML WRAPPER ━━━
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:10mm 12mm;width:210mm;min-height:297mm;
max-height:297mm;overflow:hidden;font-family:'Arial',sans-serif;
font-size:9.5pt;line-height:1.4;color:#1a1a2e;background:#fff;
box-sizing:border-box;">
</body>
</html>

━━━ SPACE BUDGET (hard limits) ━━━
- Max 3 projects, max 4 bullets each
- Max 3 experience roles, max 3 bullets each
- Summary: exactly 3 sentences
- No extra whitespace, no decorative elements
- Font sizes: Name=18pt, Tagline=10pt, Contact=9pt, Section=10pt, Body=8.5pt

═══════════════════════════════════════════════════════
STEP 3 — SCORING
═══════════════════════════════════════════════════════

Score the ORIGINAL resume for "overallScore.before" (0–100):
- Strong action verbs present       (25 pts)
- Quantified metrics in bullets     (25 pts)
- ATS keyword match with JD         (25 pts)
- Formatting clarity and structure  (25 pts)

Score the IMPROVED resume for "overallScore.after" using identical criteria.
"after" MUST always be higher than "before". Minimum improvement: 15 pts.

═══════════════════════════════════════════════════════
OUTPUT FORMAT — return ONLY this JSON, nothing else
═══════════════════════════════════════════════════════

{
  "html": "<html>...</html>",
  "overallScore": {
    "before": <number 0-100>,
    "after": <number 0-100>
  },
  "audit": {
    "weakVerbsReplaced": [{ "before": "Built", "after": "Architected" }],
    "metricsAdded": <number>,
    "keywordsMatched": ["Node.js", "REST API", "JWT"]
  }
}

Any response that is not pure valid JSON is a failed response.`;
}

function extractTextContent(content) {
  if (!content) return null;

  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.text) return item.text;
        if (typeof item?.content === "string") return item.content;
        return "";
      })
      .join("");
  }

  if (typeof content === "object") {
    if (typeof content.text === "string") return content.text;
    if (typeof content.content === "string") return content.content;
  }

  return String(content);
}

function stripCodeFences(text) {
  if (!text) return text;
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function toNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeResumeOutput(raw) {
  const html =
    typeof raw?.html === "string" && raw.html.trim()
      ? raw.html.trim()
      : "<html><head><meta charset='UTF-8'></head><body><div>Resume generation failed</div></body></html>";

  const before = clamp(toNumber(raw?.overallScore?.before, 55), 0, 100);
  let after = clamp(toNumber(raw?.overallScore?.after, before + 15), 0, 100);

  if (after <= before) {
    after = clamp(before + 10, 0, 100);
  }

  return {
    html,
    overallScore: {
      before,
      after,
    },
  };
}

async function generateResumePDFByMistral(resume, selfDescription, jobDescription) {
  const resumePrompt = buildResumePrompt(resume, selfDescription, jobDescription);

  try {
    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      temperature: 0.2,
      maxTokens: 6000,
      messages: [{ role: "user", content: resumePrompt }],
      responseFormat: { type: "json_object" },
    });

    const rawContent = response?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty response from Mistral");
    }

    const textContent = extractTextContent(rawContent);
    if (!textContent) {
      throw new Error("Mistral returned empty content");
    }

    const cleaned = stripCodeFences(textContent);
    const parsed = safeJsonParse(cleaned);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Mistral returned invalid JSON");
    }

    const normalized = normalizeResumeOutput(parsed);
    const validated = ResumeOutputSchema.parse(normalized);
    const resumePDFBuffer = await generatePDFFromHTML(validated.html);

    return {
      resumePDFBuffer,
      jsonContent: validated,
    };
  } catch (error) {
    console.error("Mistral Resume Generation Error:", error);
    throw new Error("Failed to generate resume HTML from Mistral AI service");
  }
}

module.exports = {
  generateResumePDFByMistral,
  generatePDFFromHTML,
  buildResumePrompt,
};