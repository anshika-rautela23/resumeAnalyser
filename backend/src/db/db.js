const mongoose=require('mongoose')


async function connectDB(){
    try{
        await mongoose.connect(process.env.Mongo)
        console.log("connected");
    }
    catch(err){
        console.error("MongoDB connection failed:", err.message);
    }
}


module.exports=connectDB