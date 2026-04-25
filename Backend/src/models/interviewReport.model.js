const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
  },
  { _id: false },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
    },
    severity: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid severity level",
      },
      required: [true, "Severity is required"],
    },
  },
  { _id: false },
);


const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
      min: [1, "Day must be at least 1"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
      trim: true,
    },
    tasks: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one task is required",
      },
    },
  },
  { _id: false },
);


const interviewReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User reference is required"],
      index: true,
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [10000, "Job description cannot exceed 10 000 characters"],
    },
    resume: {
      type: String,
      trim: true,
      maxlength: [50000, "Resume text cannot exceed 50 000 characters"],
    },
    selfDescription: {
      type: String,
      trim: true,
      maxlength: [5000, "Self description cannot exceed 5 000 characters"],
    },
    matchScore: {
      type: Number,
      required: [true, "Match score is required"],
      min: [0, "Match score cannot be less than 0"],
      max: [100, "Match score cannot exceed 100"],
    },
    technicalQuestions: {
      type: [questionSchema],
      default: [],
    },
    behavioralQuestions: {
      type: [questionSchema],
      default: [],
    },
    skillGaps: {
      type: [skillGapSchema],
      default: [],
    },
    preparationPlan: {
      type: [preparationPlanSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Indexes for common query patterns ───────────────────────────────────
interviewReportSchema.index({ userId: 1, createdAt: -1 }); // list reports per user
interviewReportSchema.index({ matchScore: -1 });            // leaderboard / filtering

// ── Virtual: total question count ───────────────────────────────────────
interviewReportSchema.virtual("totalQuestions").get(function () {
  return (
    (this.technicalQuestions?.length ?? 0) +
    (this.behavioralQuestions?.length ?? 0)
  );
});

// ── Static: paginated reports for a user ────────────────────────────────
interviewReportSchema.statics.findByUser = function (
  userId,
  { page = 1, limit = 10 } = {},
) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = InterviewReport;