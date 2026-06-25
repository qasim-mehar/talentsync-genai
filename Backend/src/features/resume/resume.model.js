const mongoose = require("mongoose");

/**
 * Schema for a single AI-generated resume.
 *
 * Every time the user hits the "generate resume" endpoint we save:
 *  - which user requested it          (userId)
 *  - which interview report it came from (interviewId)
 *  - the full HTML string              (htmlContent)
 *  - the before/after quality scores   (overallScore)
 *  - timestamps (auto)
 */
const generatedResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewReport",
      index: true,
    },
    /**
     * Complete, self-contained HTML string of the resume.
     * Stored as-is so it can be re-rendered or re-exported to PDF
     * at any time without re-calling the AI.
     */
    htmlContent: {
      type: String,
      required: [true, "HTML content is required"],
    },
    overallScore: {
      before: {
        type: Number,
        min: 0,
        max: 100,
      },
      after: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    pdfBase64: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Fast lookup: all resumes for a user ordered by newest first
generatedResumeSchema.index({ userId: 1, createdAt: -1 });

const GeneratedResumeModel = mongoose.model(
  "GeneratedResume",
  generatedResumeSchema
);

module.exports = GeneratedResumeModel;
