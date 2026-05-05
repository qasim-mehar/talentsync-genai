const express = require("express");
const router = express.Router();
const { userAuthMiddleware } = require("../../middleware/auth.middleware");
const { generateResumePDFController } = require("./resume.controller");


router.get("/generateResumePDF/:interviewId", userAuthMiddleware, generateResumePDFController);

module.exports = router;
