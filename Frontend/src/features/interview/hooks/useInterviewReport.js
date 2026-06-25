import { useContext } from "react";
import { useNavigate } from "react-router";
import { interviewReportContext } from "../interviewReport.context";
import { genrateInterviewReport, getInterviewReport, getInterviewReportById } from "../services/interviewReport.api";

// ─── Helper: extract a human-readable error message ──────────────────────────
function parseError(err) {
  const status = err?.response?.status;
  const data   = err?.response?.data;

  if (data && typeof data === "object" && data.message) return data.message;
  if (typeof data === "string") return data;

  if (status === 400) return "Oops, please check your input and try again.";
  if (status === 401) return "Please log in to save and generate reports.";
  if (status === 404) return "We couldn't find that report.";
  if (status === 413) return "Your resume PDF is too large. Please upload a smaller one.";
  if (status === 500) return "Our servers are taking a break. Please try again soon.";
  if (err?.message) return err.message;
  return "Something went wrong on our end. Please try again.";
}

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
     * @throws {Error} with a user-friendly message
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
            const message = parseError(err);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Fetches all report titles for the logged-in user.
     * @throws {Error} with a user-friendly message
     */
    async function handleGetAllReports() {
        setIsLoading(true);
        try {
            const res = await getInterviewReport();
            // Fix: API returns { success, message, data } — store res.data
            setAllReports(res.data);
        } catch (err) {
            const message = parseError(err);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Fetches a single full report by ID.
     * @param {string} interviewId
     * @throws {Error} with a user-friendly message
     */
    async function handleGetReportById(interviewId) {
        setIsLoading(true);
        try {
            const res = await getInterviewReportById(interviewId);
            // Fix: API returns { success, message, data } — store res.data
            setInterviewReport(res.data);
        } catch (err) {
            const message = parseError(err);
            throw new Error(message);
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
