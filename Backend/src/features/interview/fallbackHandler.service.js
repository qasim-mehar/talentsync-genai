const { generateInterviewReportByMistral } = require("./mistralReportGen.service");
const { generateInterviewReportByGemini } = require("./GeminiReportGen.service");

async function generateInterviewReportWithFallback({
  resume,
  selfDescription,
  jobDescription,
}) {
  const errors = [];

  // 1) Try Mistral first
  try {
    const report = await generateInterviewReportByMistral({
      resume,
      selfDescription,
      jobDescription,
    });

    return {
      report,
      provider: "mistral",
    };
  } catch (error) {
    console.error("Mistral failed:", error.message);
    errors.push({
      provider: "mistral",
      error: error.message,
    });
  }

  // 2) Fallback to Gemini
  try {
    const report = await generateInterviewReportByGemini({
      resume,
      selfDescription,
      jobDescription,
    });

    return {
      report,
      provider: "gemini",
    };
  } catch (error) {
    console.error("Gemini failed:", error.message);
    errors.push({
      provider: "gemini",
      error: error.message,
    });
  }

  const fallbackError = new Error("Both AI providers failed");
  fallbackError.details = errors;
  throw fallbackError;
}

module.exports = { generateInterviewReportWithFallback };