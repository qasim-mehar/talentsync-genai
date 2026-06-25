const mongoose =require("mongoose");
const express = require("express");

const authMiddleware= require("../../middleware/auth.middleware")
const interviewReportController= require("./interviewReport.controller")
const upload= require("../../middleware/file.middleware")

const router = express.Router()

router.post("/",
    // authMiddleware.optionalUserAuthMiddleware,
    upload.single("resume"),
    interviewReportController.generateInterviewReportController
)

router.get("/report/interview/:interviewId",
    authMiddleware.optionalUserAuthMiddleware,
    interviewReportController.getReportByIdController
)
router.get("/report/interview",
    authMiddleware.userAuthMiddleware,
    interviewReportController.getAllReportsController
)

module.exports=router;