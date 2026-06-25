const { Mistral } = require("@mistralai/mistralai");
const { z } = require("zod");

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// ── Schema mirrors Mongoose exactly — no artificial array length constraints ──
const InterviewReportSchema = z.object({
  title: z.string().min(1),
  matchScore: z.number().min(0).max(100),

  technicalQuestions: z
    .array(
      z.object({
        difficultyLevel: z.enum(["Easy", "Medium", "Hard"]),
        question: z.string().min(1),
        intention: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(1), // just require at least one; prompt enforces 5-8

  behavioralQuestions: z
    .array(
      z.object({
        category: z.string().min(1),
        question: z.string().min(1),
        intention: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(1),

  skillGaps: z.array(
    z.object({
      skill: z.string().min(1),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().int().min(1),
        focus: z.string().min(1),
        tasks: z.array(z.string().min(1)).min(1),
      })
    )
    .min(1),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractTextContent(content) {
  if (!content) return null;
  if (typeof content === "string") return content;
  if (Array.isArray(content))
    return content.map((i) => (typeof i === "string" ? i : i?.text ?? "")).join("");
  if (typeof content === "object" && content.text) return content.text;
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

// ── Main service ──────────────────────────────────────────────────────────────

async function generateInterviewReportByMistral({ resume, selfDescription, jobDescription }) {
  const prompt = `
You are an expert technical interviewer with 15 years of experience.
Return ONLY valid JSON with this exact structure — no markdown, no explanation:

{
  "title": "string (1-3 words max)",
  "matchScore": number between 0 and 100,
  "technicalQuestions": [
    {
      "difficultyLevel": "Easy" | "Medium" | "Hard",
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestions": [
    {
      "category": "string",
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number (integer starting at 1),
      "focus": "string",
      "tasks": ["string", "string"]
    }
  ]
}

Quantity requirements:
- technicalQuestions: exactly 6
- behavioralQuestions: exactly 4
- preparationPlan: exactly 7 days (day 1 through 7)
- skillGaps: 2 to 5 items

CANDIDATE PROFILE:
Resume:
${resume}

Self Description:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}
`.trim();

  const response = await mistral.chat.complete({
    model: "mistral-large-latest",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const rawContent = response?.choices?.[0]?.message?.content;
  if (!rawContent) throw new Error("Empty response from Mistral");

  const textContent = extractTextContent(rawContent);
  const cleaned = stripCodeFences(textContent);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("JSON parse failed:\n", cleaned);
    throw new Error(`Invalid JSON from Mistral: ${parseErr.message}`);
  }

  // ── Detailed Zod error logging ────────────────────────────────────────────
  const result = InterviewReportSchema.safeParse(parsed);
  if (!result.success) {
    console.error(
      "ZOD VALIDATION FAILED:\n",
      JSON.stringify(result.error.issues, null, 2)
    );
    console.error("PARSED OBJECT:\n", JSON.stringify(parsed, null, 2));
    throw new Error("Mistral returned invalid interview schema");
  }

  return result.data;
}

module.exports = { generateInterviewReportByMistral };