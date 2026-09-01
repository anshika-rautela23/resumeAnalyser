require("dotenv").config()
const app=require('./app')
const connectDB=require('./src/db/db')
connectDB()

app.use("/api/auth",require('./src/routes/auth.routes'))

app.listen(3000,()=>{
    console.log("server running ")
})


