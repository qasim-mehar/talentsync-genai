import { createContext, useState } from "react";

const interviewReportContext=createContext();

export function InterviewReportProvider({children}) {
    const [isLoading,setIsLoading]=useState(false);
    const [interviewReport,setInterviewReport]=useState(null);
    const [allReports, setAllReports] = useState([]);
   
    return (
        <interviewReportContext.Provider value={{isLoading,setIsLoading,interviewReport,setInterviewReport,allReports, setAllReports}}>
            {children}
        </interviewReportContext.Provider>
    )
    
}