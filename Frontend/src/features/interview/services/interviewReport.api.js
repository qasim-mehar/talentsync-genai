import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/interview/",
    withCredentials: true,
});

/**
 * @service generateInterviewReport
 * @desc POST resume + job/self descriptions to generate AI interview report
 * @note Multer expects the file under the field name "resume" (matches upload.single("resume"))
 */
export async function genrateInterviewReport({ jobDescription, selfDescription, resumeFile }) {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);
    try {
        const res = await api.post("", formData);
        return res.data;
    } catch (err) {
        console.error("generateInterviewReport failed:", err);
        throw err;
    }
}

/**
 * @service getInterviewReport
 * @desc GET all report titles for the logged-in user
 */
export async function getInterviewReport() {
    try {
        const res = await api.get("report/interview");
        return res.data;
    } catch (error) {
        console.error("getInterviewReport failed:", error);
        throw error;
    }
}

/**
 * @service getInterviewReportById
 * @desc GET a single full report by its ID
 */
export async function getInterviewReportById(interviewId) {
    try {
        const res = await api.get(`report/interview/${interviewId}`);
        return res.data;
    } catch (error) {
        console.error("getInterviewReportById failed:", error);
        throw error;
    }
}
