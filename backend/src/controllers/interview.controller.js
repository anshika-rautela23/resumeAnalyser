const { PDFParse }=require('pdf-parse')
const generateInterviewReport=require('../services/ai.service')
const { interviewModel }=require('../model/interviewReport.model')

async function generateInterviewReportController(req,res){
    try {
        const resumeFile=req.file
        if (!resumeFile) {
            return res.status(400).json({ message: 'A PDF resume is required' })
        }
        const parser=new PDFParse({data:resumeFile.buffer})
        const {text:resumeContent}=await parser.getText()
        await parser.destroy()
        const {selfDescription,jobDescription}=req.body

        const interviewByAi=await generateInterviewReport({
            resume:resumeContent,
            selfDescription,
            jobDescription
        })

        const interviewReport=await interviewModel.create({
            user:req.user.id,
            resume:resumeContent,
            selfDescription,
            job:jobDescription,
            ...interviewByAi
        })
        return res.status(201).json({
            message:'Interview report generated successfully',
            interviewReport
        })
    } catch (error) {
        console.error('Interview report generation failed:', error)
        return res.status(502).json({ message: 'The AI did not return a complete interview report. Please try again.' })
    }
}

async function getInterviewReportController(req, res) {
    const interviewReport = await interviewModel.findOne({ _id: req.params.id, user: req.user.id }).select('-resume')
    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found' })
    }
    return res.json({ interviewReport })
}

async function downloadResumeController(req, res) {
    const interviewReport = await interviewModel.findOne({ _id: req.params.id, user: req.user.id }).select('resume')
    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found' })
    }
    res.type('text/plain').attachment('resume.txt').send(interviewReport.resume || '')
}



module.exports={generateInterviewReportController, getInterviewReportController, downloadResumeController}