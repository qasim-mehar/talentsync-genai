const { GoogleGenAI, Type } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.Gemini_API_Key,
});

// Generate PDF from HTML
async function generatPDFfromHTML(resumeHTML) {
    const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setContent(resumeHTML, {
  waitUntil: "networkidle0",
});

// Generate PDF (returns buffer)
const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
});

await browser.close();
return pdfBuffer;
}
// Gemini requires responseSchema to be a root OBJECT with fields nested under "properties".
const resumeOutputSchema = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description: "The complete, self-contained HTML resume with inline CSS only.",
    },
    overallScore: {
      type: Type.OBJECT,
      properties: {
        before: { type: Type.NUMBER },
        after: { type: Type.NUMBER },
      },
    },
  },
  required: ["html", "overallScore"],
};

async function generateResumePDF(resume, selfDescription, jobDescription) {
  const resumePrompt = `You are an elite resume writer and career coach. Transform the candidate's raw resume data into a polished, ATS-optimized HTML resume while improving content quality.

═══════════════════════════════════════════
CANDIDATE DATA
═══════════════════════════════════════════
Resume:
${resume}

Self Description:
${selfDescription || "Not provided."}

Target Job Description:
${jobDescription}

═══════════════════════════════════════════
CONTENT IMPROVEMENT RULES
═══════════════════════════════════════════
Apply all 5 rules internally before writing any HTML:

RULE 1 — ACTION VERBS
- Every bullet MUST start with a strong action verb.
- Banned: helped, worked on, assisted, was responsible for, participated in.
- Use by category:
  Dev/Eng  → Engineered, Architected, Optimized, Refactored, Automated
  Analysis → Diagnosed, Benchmarked, Evaluated, Mapped
  Leadership → Spearheaded, Championed, Mentored, Orchestrated
  Results  → Delivered, Reduced, Increased, Accelerated, Scaled

RULE 2 — HARD SKILLS
- Only use skills from the raw data. Normalize names (e.g. "mongo" → "MongoDB").
- Group by: Languages | Frameworks | Tools | Databases

RULE 3 — SOFT SKILLS (show, don't tell)
- Never state soft skills directly. Embed them as evidence in bullets.
  e.g. "Partnered with UI/UX team to align component behavior with Figma specs."

RULE 4 — METRICS
- Add numbers to every bullet. Use conservative realistic estimates if absent, append "(est.)".
  Patterns: volume (10,000+ users), speed (~40% faster), scale (500+ students).

RULE 5 — ACHIEVEMENT FORMULA
- Format: [Verb] + [What] + [Tool/Method] + [Result]
  BAD:  "Worked on a React app."
  GOOD: "Engineered a React.js movie app using OMDB API, cutting redundant API calls by ~60% (est.)."

═══════════════════════════════════════════
HTML OUTPUT RULES
═══════════════════════════════════════════
1. Inline CSS ONLY — no <style> tags, no external CSS, no class-based frameworks.
2. Self-contained single HTML string that renders correctly in a headless browser (Puppeteer).
3. Layout: clean single or two-column. Section order: Header → Summary → Skills → Experience → Projects → Education → Certifications.
4. Typography: headings use 'Georgia', serif; body uses 'Arial', sans-serif.
5. Color: monochromatic, print-safe, max 2 accent colors.
6. Mark improved bullets with a subtle left border accent (e.g. border-left: 3px solid #2563eb).

═══════════════════════════════════════════
RETURN FORMAT
═══════════════════════════════════════════
Return a JSON object with two fields:
- "html": the full HTML resume string.
- "overallScore": { before, after } .`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: resumePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeOutputSchema,
      },
    });
    const jsonContent= JSON.parse(result.text);
    const resumePDFBuffer=await generatPDFfromHTML(jsonContent.html);
    return {resumePDFBuffer,jsonContent};

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate resume HTML from AI service");
  }
}



module.exports = { generateResumePDF };




