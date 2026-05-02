const PDFParse = require("pdf-parse");
const mongoose = require("mongoose");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport } = require("../services/ai.service");

const ALLOWED_MIME_TYPES = ["application/pdf"];
const MAX_RESUME_CHARS = 50000;
const MIN_JOB_DESC_LENGTH = 20;
const MAX_JOB_DESC_LENGTH = 10000;
const MAX_SELF_DESC_LENGTH = 5000;

/**
 * Cleans raw PDF-parsed text by normalizing whitespace artifacts.
 * @param {string} raw - The raw text from pdf-parse
 * @returns {string} Cleaned, human-readable text
 */
function cleanResumeText(raw) {
  return raw
    .replace(/\t+/g, " ")            // collapse tabs into single space
    .replace(/ {2,}/g, " ")          // collapse multiple spaces
    .replace(/^\s+$/gm, "")          // clear whitespace-only lines
    .replace(/\n{3,}/g, "\n\n")      // max two consecutive newlines
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "") // remove "-- 1 of 1 --" footer
    .trim();
}

/**
 * @route   POST /api/interview
 * @desc    Generate an AI-powered interview preparation report
 * @access  Private (requires JWT)
 *
 * @body    {string}  jobDescription  - The job posting text (required)
 * @body    {string}  selfDescription - Candidate self-introduction (optional)
 * @file    resume                    - PDF file upload (required, max 3 MB)
 *
 * @returns {201} Created interview report
 * @returns {400} Validation error (missing fields, bad file type, empty PDF)
 * @returns {500} Server / AI generation error
 */
async function generateInterviewReportController(req, res) {
  try {
    
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

   
    let cleanedResume;
    try {
      const resumeContent = await new PDFParse.PDFParse(
        Uint8Array.from(req.file.buffer),
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

    
    let interviewReportByAI;
    try {
      interviewReportByAI = await generateInterviewReport({
        resume: cleanedResume,
        selfDescription: trimmedSelfDesc,
        jobDescription: trimmedJobDesc,
      });
    } catch (aiError) {
      console.error("AI generation failed:", aiError);
      return res.status(500).json({
        success: false,
        message:
          "AI service is temporarily unavailable. Please try again in a few moments",
      });
    }

   
    const interviewReport = await interviewReportModel.create({
      userId: req.user._id,
      jobDescription: trimmedJobDesc,
      selfDescription: trimmedSelfDesc,
      resume: cleanedResume,
      ...interviewReportByAI,
    });

    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      data: interviewReport,
    });
  } catch (error) {
    console.error("Interview report generation failed:", error);

    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later",
    });
  }
}

async function getAllReportsController(req, res) {
  try {
    const userId = req.user._id;
    // Fetch all reports for the logged in user, sorted by newest first
    const reports = await interviewReportModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.error("Failed to fetch all reports:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching reports",
    });
  }
}

async function getReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    // Validate the ID format to prevent Mongoose CastErrors
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
      });
    }

    // Query by BOTH report ID and userId to prevent IDOR vulnerabilities
    const report = await interviewReportModel.findOne({
      _id: interviewId,
      userId: req.user._id,
    });


    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error) {
    console.error("Failed to fetch report by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the report",
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getReportByIdController,
  getAllReportsController,
};
