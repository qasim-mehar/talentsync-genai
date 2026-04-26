const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const interviewReportController = require("../controllers/interviewReport.controller");
const upload = require("../middleware/file.middleware");

const router = express.Router();

/**
 * @route   POST /api/interview
 * @desc    Generate a new AI interview report (requires resume PDF upload)
 */
router.post(
  "/",
  authMiddleware.userAuthMiddleware,
  upload.single("resume"),
  interviewReportController.generateInterviewReportController,
);

/**
 * @route   GET /api/interview
 * @desc    List all reports for the authenticated user (paginated)
 */
router.get(
  "/",
  authMiddleware.userAuthMiddleware,
  interviewReportController.getUserReportsController,
);

/**
 * @route   GET /api/interview/:id
 * @desc    Get a single report by ID
 */
router.get(
  "/:id",
  authMiddleware.userAuthMiddleware,
  interviewReportController.getReportByIdController,
);

/**
 * @route   DELETE /api/interview/:id
 * @desc    Delete a report by ID
 */
router.delete(
  "/:id",
  authMiddleware.userAuthMiddleware,
  interviewReportController.deleteReportController,
);

module.exports = router;