const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./src/routes/auth.routes')
const cors=require("cors")
const { interviewRoutes } = require('./src/routes/interview.routes')
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true
}))
app.use('/api/auth', authRoutes)
app.use('/api/interview',interviewRoutes)
module.exports = app;