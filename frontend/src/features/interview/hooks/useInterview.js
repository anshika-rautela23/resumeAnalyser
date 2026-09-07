import { useCallback, useState } from "react"
import { createInterviewReport, downloadInterviewResume, getInterviewReport } from "../services/interview.api.js"

export function useInterview() {
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const generateReport = async (input) => {
        setLoading(true)
        setError("")
        try {
            const nextReport = await createInterviewReport(input)
            setReport(nextReport)
            return nextReport
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to generate the interview report")
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        setError("")
        try {
            const nextReport = await getInterviewReport(interviewId)
            setReport(nextReport)
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load the interview report")
        } finally {
            setLoading(false)
        }
    }, [])

    const getResumePdf = async (interviewId) => {
        try {
            await downloadInterviewResume(interviewId)
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to download the resume")
        }
    }

    return { report, loading, error, generateReport, getReportById, getResumePdf }
}