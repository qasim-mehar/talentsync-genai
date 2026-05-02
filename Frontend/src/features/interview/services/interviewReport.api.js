import axios from "axios";

const api =  axios.create({
    baseURL:"localhost:3000/api/interview/",
    withCredentials:true,
})

export async function genrateInterviewReport({ jobDescription, selfDescription, resumeFile } ) {
    const formData= new FormData();
    formData.append("jobDescription",jobDescription);
    formData.append("selfDescription",selfDescription);
    formData.append("resumeFile",resumeFile);
    try {
        const res = await api.post("",formData,{
            headers:{
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getInterviewReport() {
    try {
        const res = await api.get("report/interview");
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function getInterviewReportById(interviewId) {
    try {
        const res = await api.get(`report/interview/${interviewId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

