const mongoose = require("mongoose");
const InterviewReportModel = require("../interview/interviewReport.model");
const GeneratedResumeModel = require("./resume.model");
// const { generateResumePDF } = require("./resume.service");
const {generateResumePDFWithFallback }= require("./resumeGenFallbackHandler.service")
const PDFParse = require("pdf-parse");


const ALLOWED_MIME_TYPES = ["application/pdf"];
const MAX_RESUME_CHARS = 50000;
const MIN_JOB_DESC_LENGTH = 20;
const MAX_JOB_DESC_LENGTH = 10000;
const MAX_SELF_DESC_LENGTH = 5000;

/**
 * Cleans raw PDF-parsed text by normalizing whitespace artifacts.
 */
function cleanResumeText(raw) {
  return raw
    .replace(/\t+/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/^\s+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .trim();
}

/**
 * @route   POST /api/interview
 * @desc    Generate an AI-powered interview preparation report
 * @access  Public
 */
async function generateResumeController(req, res) {
  try {
    const { interviewId } = req.params;
    //file checks
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF file is required",
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type "${req.file.mimetype}". Only PDF files are accepted`,
      });
    }

    /* - body checks  */
    const { jobDescription, selfDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    const trimmedJobDesc = jobDescription.trim();
    if (trimmedJobDesc.length < MIN_JOB_DESC_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Job description must be at least ${MIN_JOB_DESC_LENGTH} characters`,
      });
    }

    if (trimmedJobDesc.length > MAX_JOB_DESC_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Job description cannot exceed ${MAX_JOB_DESC_LENGTH} characters`,
      });
    }

    const trimmedSelfDesc = selfDescription?.trim() || "";
    if (trimmedSelfDesc.length > MAX_SELF_DESC_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Self description cannot exceed ${MAX_SELF_DESC_LENGTH} characters`,
      });
    }

    /*  parse resume  */
    let cleanedResume;

    try {
      const resumeContent = await new PDFParse.PDFParse(
        Uint8Array.from(req.file.buffer)
      ).getText();

      cleanedResume = cleanResumeText(resumeContent.text);
    } catch (parseError) {
      console.error("PDF parsing failed:", parseError);
      return res.status(400).json({
        success: false,
        message:
          "Failed to parse the uploaded PDF. Please ensure it is a valid, non-corrupted PDF file",
      });
    }

    if (!cleanedResume || cleanedResume.length < 10) {
      return res.status(400).json({
        success: false,
        message:
          "The uploaded PDF appears to be empty or contains no extractable text. Please upload a text-based (non-scanned) PDF",
      });
    }

    if (cleanedResume.length > MAX_RESUME_CHARS) {
      return res.status(400).json({
        success: false,
        message: `Resume text is too long (${cleanedResume.length} chars). Maximum allowed is ${MAX_RESUME_CHARS} characters`,
      });
    }

    /*  AI generation  */
    const { resumePDFBuffer, jsonContent } = await generateResumePDFWithFallback(
      {resume : cleanedResume,
      selfDescription:trimmedSelfDesc,
      jobDescription:trimmedJobDesc
    }
    );

    // ── Persist the generated resume to MongoDB ───────────────────────────
    const savedResume = await GeneratedResumeModel.create({
      userId: req.user?._id || undefined,
      interviewId: interviewId || undefined,
      htmlContent: jsonContent.html,
      overallScore: jsonContent.overallScore,
      pdfBase64: resumePDFBuffer.toString("base64"),
    });

    // ── Stream PDF back to the client ─────────────────────────────────────
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume_${interviewId}.pdf`
    );
    // Return the saved resume's ID in a custom header so the frontend can
    // reference it without needing a separate follow-up request
    res.setHeader("X-Resume-Id", savedResume._id.toString());

    res.send(resumePDFBuffer);
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate resume PDF" });
  }
}



/**
 * @route   GET /api/resume/generate/:interviewId
 * @desc    Generate an AI-improved, single-page A4 resume PDF from an
 *          interview report. The result is saved to MongoDB so it can be
 *          retrieved later without re-calling the AI.
 * @access  Private (requires JWT)
 */
async function generateResumePDFUsingReportController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid interview ID format" });
    }

    // Fetch the parent interview report (ensures ownership via userId)
    const interviewReport = await InterviewReportModel.findOne({
      _id: interviewId,
      userId: req.user._id,
    });

    if (!interviewReport) {
      return res
        .status(404)
        .json({ success: false, message: "Interview report not found" });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;
    console.log(resume);
    console.log(selfDescription);
    console.log(jobDescription);

    if (!resume || resume.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "This report has no resume text stored. Re-generate the interview report first.",
      });
    }

    // ── Call AI service ───────────────────────────────────────────────────
    const { resumePDFBuffer, jsonContent } = await generateResumePDFWithFallback(
      {resume,
      selfDescription,
      jobDescription}
    );

    // ── Persist the generated resume to MongoDB ───────────────────────────
    const savedResume = await GeneratedResumeModel.create({
      userId: req.user._id,
      interviewId: interviewReport._id,
      htmlContent: jsonContent.html,
      overallScore: jsonContent.overallScore,
      pdfBase64: resumePDFBuffer.toString("base64"),
    });

    // ── Stream PDF back to the client ─────────────────────────────────────
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume_${interviewId}.pdf`
    );
    // Return the saved resume's ID in a custom header so the frontend can
    // reference it without needing a separate follow-up request
    res.setHeader("X-Resume-Id", savedResume._id.toString());

    res.send(resumePDFBuffer);
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate resume PDF" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST ALL RESUMES  — GET /api/resume/
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @route   GET /api/resume/
 * @desc    Return a lightweight list of every resume generated by the current
 *          user (id, scores, interview link, dates). No HTML blob is returned
 *          to keep the response small.
 * @access  Private (requires JWT)
 */
async function getUserResumesController(req, res) {
  try {
    const resumes = await GeneratedResumeModel.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-htmlContent") // omit large HTML field from list view
      .populate("interviewId", "title jobDescription createdAt") // pull report title
      .lean();

    return res.status(200).json({
      success: true,
      message: "Resumes fetched successfully",
      data: resumes,
    });
  } catch (error) {
    console.error("Failed to fetch user resumes:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching resumes",
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET RESUME BY ID  — GET /api/resume/:resumeId
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @route   GET /api/resume/:resumeId
 * @desc    Return the full HTML content + scores of a single saved resume.
 *          Ownership is enforced via userId — users can only read their own.
 * @access  Private (requires JWT)
 */
async function getResumeByIdController(req, res) {
  try {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid resume ID format" });
    }

    const resume = await GeneratedResumeModel.findOne({
      _id: resumeId,
      userId: req.user._id, // IDOR guard
    })
      .populate("interviewId", "title createdAt")
      .lean();

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Failed to fetch resume by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the resume",
    });
  }
}

async function downloadResumeController(req, res) {
  try {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ success: false, message: "Invalid resume ID" });
    }

    const resume = await GeneratedResumeModel.findById(resumeId).lean();

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (!resume.pdfBase64) {
      return res.status(404).json({ success: false, message: "PDF not available for this resume" });
    }

    const buffer = Buffer.from(resume.pdfBase64, "base64");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=talentsync_resume_${resumeId}.pdf`);
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);

  } catch (error) {
    console.error("Failed to download resume:", error);
    res.status(500).json({ success: false, message: "Failed to download resume" });
  }
}

module.exports = {
  generateResumeController,
  generateResumePDFUsingReportController,
  getUserResumesController,
  getResumeByIdController,
  downloadResumeController,
};
