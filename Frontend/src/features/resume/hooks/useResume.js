import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { resumeContext } from "../resume.context";
import {
  generateResumePDF,
  generateResumePublic,
  getUserResumes,
  getResumeById,
} from "../services/resume.api";

// ─── Helper: extract a human-readable error message ──────────────────────────
function parseError(err) {
  // Server responded with a JSON body
  if (err?.response?.data) {
    // Blob response — need to read the JSON text
    const data = err.response.data;
    if (data instanceof Blob) {
      // Fallback: generic server error from blob response
      const status = err.response.status;
      if (status === 400) return "Oops, we couldn't create your resume. Please check your PDF format and make sure it has text.";
      if (status === 401) return "Please log in to continue.";
      if (status === 404) return "We couldn't find that report.";
      if (status === 500) return "Our servers are taking a break. Please try again soon.";
      return "Something went wrong on our end. Please try again.";
    }
    if (typeof data === "object" && data.message) return data.message;
    if (typeof data === "string") return data;
  }
  if (err?.message) return err.message;
  return "Something went wrong. Please try again.";
}

// ─── Hook (business logic layer) ─────────────────────────────────────────────
/**
 * useResume — bridges the API layer and the state layer.
 * Reads/writes resumeContext. Contains all resume business logic.
 */
export function useResume() {
  const context = useContext(resumeContext);
  const {
    allResumes,
    setAllResumes,
    currentResume,
    setCurrentResume,
    resumeIsLoading,
    setResumeIsLoading,
    lastGeneratedResumeId,
    setLastGeneratedResumeId,
  } = context;

  const navigate = useNavigate();

  /**
   * Generates a resume PDF for a given interview report (requires login).
   * Downloads the PDF immediately and navigates to the saved resume view.
   * @param {string} interviewId
   * @throws {Error} with a user-friendly message
   */
  async function handleGenerateResume(interviewId) {
    setResumeIsLoading(true);
    try {
      const { blob, resumeId } = await generateResumePDF(interviewId);

      const url = URL.createObjectURL(blob);

      // Store the ID and navigate to the preview page
      if (resumeId) {
        setLastGeneratedResumeId(resumeId);
      }
      
      // Navigate to preview page passing the blob URL and resumeId
      navigate("/resume/preview", { state: { pdfBlobUrl: url, resumeId: resumeId } });
    } catch (err) {
      const message = parseError(err);
      throw new Error(message);
    } finally {
      setResumeIsLoading(false);
    }
  }

  /**
   * Generates a resume PDF from raw inputs — NO login required.
   * Automatically downloads the PDF. If a resume ID is returned (user logged in),
   * navigates to the resume viewer.
   * @param {{ resumeFile: File, jobDescription: string, selfDescription: string }}
   * @throws {Error} with a user-friendly message
   */
  async function handleGenerateResumePublic({ resumeFile, jobDescription, selfDescription }) {
    setResumeIsLoading(true);
    try {
      const { blob, resumeId } = await generateResumePublic({
        resumeFile,
        jobDescription,
        selfDescription,
      });

      const url = URL.createObjectURL(blob);

      // Store the ID
      if (resumeId) {
        setLastGeneratedResumeId(resumeId);
      }
      
      // Always navigate to preview page with the blob URL
      navigate("/resume/preview", { state: { pdfBlobUrl: url, resumeId: resumeId } });
    } catch (err) {
      const message = parseError(err);
      throw new Error(message);
    } finally {
      setResumeIsLoading(false);
    }
  }

  /**
   * Fetches lightweight list of all resumes for the logged-in user.
   * @throws {Error} with a user-friendly message
   */
  async function handleGetUserResumes() {
    setResumeIsLoading(true);
    try {
      const res = await getUserResumes();
      setAllResumes(res.data || []);
    } catch (err) {
      const message = parseError(err);
      throw new Error(message);
    } finally {
      setResumeIsLoading(false);
    }
  }

  /**
   * Fetches full HTML + scores for a single saved resume.
   * @param {string} resumeId
   * @throws {Error} with a user-friendly message
   */
  async function handleGetResumeById(resumeId) {
    setResumeIsLoading(true);
    try {
      const res = await getResumeById(resumeId);
      setCurrentResume(res.data);
    } catch (err) {
      const message = parseError(err);
      throw new Error(message);
    } finally {
      setResumeIsLoading(false);
    }
  }

  return {
    allResumes,
    currentResume,
    resumeIsLoading,
    lastGeneratedResumeId,
    handleGenerateResume,
    handleGenerateResumePublic,
    handleGetUserResumes,
    handleGetResumeById,
  };
}
