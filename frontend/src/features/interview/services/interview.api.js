import axios from "axios"

const API_URL = "http://localhost:3000/api/interview"

export async function createInterviewReport({ jobDescription, selfDescription, resume }) {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resume)

    const response = await axios.post(API_URL, formData, { withCredentials: true })
    return response.data.interviewReport
}

export async function getInterviewReport(interviewId) {
    const response = await axios.get(`${API_URL}/${interviewId}`, { withCredentials: true })
    return response.data.interviewReport
}

export async function downloadInterviewResume(interviewId) {
    const response = await axios.get(`${API_URL}/${interviewId}/resume`, {
        withCredentials: true,
        responseType: "blob",
    })
    const url = URL.createObjectURL(response.data)
    const link = document.createElement("a")
    link.href = url
    link.download = "resume.txt"
    link.click()
    URL.revokeObjectURL(url)
}