import axios from "axios";

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:3000/api/resume/",
  withCredentials: true,
});

// ─── API Functions (pure data layer — no state, no side-effects) ──────────────

/**
 * @api generateResumePDF
 * @desc  Calls GET /api/resume/generate/:interviewId
 *        Triggers AI generation + DB persistence on the server.
 *        Returns the PDF blob + the saved resume's MongoDB _id (from response header).
 * @param {string} interviewId
 * @returns {{ blob: Blob, resumeId: string }}
 */
export async function generateResumePDF(interviewId) {
  try {
    const res = await api.get(`generate/${interviewId}`, {
      responseType: "blob",
    });
    const resumeId = res.headers["x-resume-id"] || null;
    const blob = new Blob([res.data], { type: "application/pdf" });
    return { blob, resumeId };
  } catch (err) {
    console.error("generateResumePDF failed:", err);
    throw err;
  }
}

/**
 * @api generateResumePublic
 * @desc  Calls POST /api/resume/generate/ (no login required).
 *        Accepts a resume PDF file + job description + self description.
 *        Returns the PDF blob + optional resume ID if user is logged in.
 * @param {{ resumeFile: File, jobDescription: string, selfDescription: string }}
 * @returns {{ blob: Blob, resumeId: string|null }}
 */
export async function generateResumePublic({ resumeFile, jobDescription, selfDescription }) {
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription || "");

    const res = await api.post("generate/", formData, {
      responseType: "blob",
    });

    const resumeId = res.headers["x-resume-id"] || null;
    const blob = new Blob([res.data], { type: "application/pdf" });
    return { blob, resumeId };
  } catch (err) {
    console.error("generateResumePublic failed:", err);
    throw err;
  }
}

/**
 * @api getUserResumes
 * @desc  Calls GET /api/resume/ — returns metadata list (no heavy HTML)
 * @returns {{ success: boolean, data: Array }}
 */
export async function getUserResumes() {
  try {
    const res = await api.get("/");
    return res.data;
  } catch (err) {
    console.error("getUserResumes failed:", err);
    throw err;
  }
}

/**
 * @api getResumeById
 * @desc  Calls GET /api/resume/:resumeId — returns full HTML + scores
 * @param {string} resumeId
 * @returns {{ success: boolean, data: Object }}
 */
export async function getResumeById(resumeId) {
  try {
    const res = await api.get(`/${resumeId}`);
    return res.data;
  } catch (err) {
    console.error("getResumeById failed:", err);
    throw err;
  }
}
