const mongoose =require("mongoose");
const express = require("express");

const authMiddleware= require("../middleware/auth.middleware")
const interviewReportController= require("../controllers/interviewReport.controller")
const upload= require("../middleware/file.middleware")

const router = express.Router()

router.post("/", 
    authMiddleware.userAuthMiddleware,
    upload.single("resume"),
    interviewReportController.generateInterviewReportController
)

module.exports=router;