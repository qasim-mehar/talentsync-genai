const { generateResumePDFByMistral } = require("./mistralResumeGen.service");
const { generateResumePDFByGemini } = require("./geminiResumeGen.service");

async function generateResumePDFWithFallback({
  resume,
  selfDescription,
  jobDescription,
}) {
  const errors = [];

  // 1) Try Mistral first
  try {
    const result = await generateResumePDFByMistral(
      resume,
      selfDescription,
      jobDescription
    );

    return {
      ...result,
      provider: "mistral",
    };
  } catch (error) {
    console.error("Resume Mistral failed:", error.message);
    errors.push({
      provider: "mistral",
      error: error.message,
    });
  }

  // 2) Fallback to Gemini
  try {
    const result = await generateResumePDFByGemini(
      resume,
      selfDescription,
      jobDescription
    );

    return {
      ...result,
      provider: "gemini",
    };
  } catch (error) {
    console.error("Resume Gemini failed:", error.message);
    errors.push({
      provider: "gemini",
      error: error.message,
    });
  }

  const fallbackError = new Error("Both AI providers failed for resume generation");
  fallbackError.details = errors;
  throw fallbackError;
}

module.exports = {
  generateResumePDFWithFallback,
};