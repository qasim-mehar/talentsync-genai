const mongoose = require("mongoose");
const InterviewReportModel = require("../interview/interviewReport.model");
const { generateResumePDF } = require("./resume.service");

async function generateResumePDFController(req, res) {
  try {
    const { interviewId } = req.params;



    const interviewReport = await InterviewReportModel.findOne({_id:interviewId, userId:req.user._id})

   
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    if (!resume || resume.trim().length === 0) {
      return res.status(400).json({ message: "This report has no resume text stored. Re-generate the report first." });
    }

    const { resumePDFBuffer } = await generateResumePDF(resume, selfDescription, jobDescription);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=resume_${interviewId}.pdf`);
    res.send(resumePDFBuffer);
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    res.status(500).json({ message: "Failed to generate resume PDF" });
  }
}

module.exports = { generateResumePDFController };
