import { useContext } from "react";
import { useNavigate } from "react-router";
import { interviewReportContext } from "../interviewReport.context";
import { genrateInterviewReport, getInterviewReport, getInterviewReportById } from "../services/interviewReport.api";

export const useInterviewReport = () => {
    const context = useContext(interviewReportContext);

    // Fix: context state uses "interviewReport"/"setInterviewReport" (match context exactly)
    const { isLoading, setIsLoading, interviewReport, setInterviewReport, allReports, setAllReports } = context;

    const navigate = useNavigate();

    /**
     * Generates a new interview report and navigates to the result page.
     * @param {string} jobDescription
     * @param {string} selfDescription
     * @param {File}   resumeFile
     */
    async function handleGenrateInterviewReport({ selfDescription, jobDescription, resumeFile }) {
        setIsLoading(true);
        try {
            const res = await genrateInterviewReport({ selfDescription, jobDescription, resumeFile });
            // Fix: API returns { success, message, data } — store res.data not res
            setInterviewReport(res.data);
            // Navigate after state is set using the returned id directly (not stale state)
            navigate(`/interview-report/${res.data._id}`);
        } catch (err) {
            console.error("handleGenrateInterviewReport failed:", err);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Fetches all report titles for the logged-in user.
     */
    async function handleGetAllReports() {
        setIsLoading(true);
        try {
            const res = await getInterviewReport();
            // Fix: API returns { success, message, data } — store res.data
            setAllReports(res.data);
        } catch (err) {
            console.error("handleGetAllReports failed:", err);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Fetches a single full report by ID.
     * @param {string} interviewId
     */
    async function handleGetReportById(interviewId) {
        setIsLoading(true);
        try {
            const res = await getInterviewReportById(interviewId);
            // Fix: API returns { success, message, data } — store res.data
            setInterviewReport(res.data);
        } catch (err) {
            // Fix: typo "er" → "err"
            console.error("handleGetReportById failed:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        report: interviewReport,
        allReports,
        handleGenrateInterviewReport,
        handleGetAllReports,
        handleGetReportById,
    };
};
