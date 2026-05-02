import { interviewReportContext } from "../InterviewReport.context";
import {genrateInterviewReport, getInterviewReport, getInterviewReportById} from "../services/interviewReport.api"
import { useContext } from "react";


export const useInterviewReport = () => {
    const context =useContext(interviewReportContext);
    const {isLoading, setIsLoading, report, setReport, allReport, setAllReport}=context

    async function handleGenrateInterviewReport({SelfDescription, JobDescription, resumeFile}){
        setIsLoading(true);
        try {
            const res=await genrateInterviewReport({SelfDescription, JobDescription, resumeFile});
            setReport(res.data)
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false)
        }
    }

    async function handleGetAllReports() {
        setIsLoading(true)
        try {
            const res= await getInterviewReport();
            setAllReport(res.data)
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false)
        }
    }

    async function handleGetReportById(interviewId) {
        setIsLoading(true);
        try {
            const res=await getInterviewReportById(interviewId);
            setReport(res.data);
        } catch (err) {
            console.log(er);
        }finally{
            setIsLoading(false)
        }
    }

    return {handleGenrateInterviewReport,handleGetAllReports,handleGetReportById}

}


