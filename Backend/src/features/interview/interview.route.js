const mongoose =require("mongoose");
const express = require("express");

const authMiddleware= require("../../middleware/auth.middleware")
const interviewReportController= require("./interviewReport.controller")
const upload= require("../../middleware/file.middleware")

const router = express.Router()

router.post("/", 
    authMiddleware.userAuthMiddleware,
    upload.single("resume"),
    interviewReportController.generateInterviewReportController
)

router.get("/report/interview/:interviewId",
    authMiddleware.userAuthMiddleware, 
    interviewReportController.getReportByIdController
)
router.get("/report/interview",
    authMiddleware.userAuthMiddleware, 
    interviewReportController.getAllReportsController
)

module.exports=router;