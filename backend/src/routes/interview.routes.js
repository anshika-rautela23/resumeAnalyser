const express=require('express')
const authMiddleware=require('../middleware/auth.middleware')
const interviewController=require('../controllers/interview.controller')
const interviewRoutes=express.Router()
const { upload }=require('../middleware/file.middleware')


interviewRoutes.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)
interviewRoutes.get("/:id",authMiddleware.authUser,interviewController.getInterviewReportController)
interviewRoutes.get("/:id/resume",authMiddleware.authUser,interviewController.downloadResumeController)

module.exports={interviewRoutes}