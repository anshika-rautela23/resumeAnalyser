 const mongoose=require('mongoose')


 const technical=new mongoose.Schema({
   question:{
        type:String,
        required:[true,"technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    }
 },{
    _id:false
 })

 const behavioral=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    }
 },{
    _id:false
 })
 
 const skillGap=new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:['low','medium','high'],
        required:[true,"severity is true"]
    }
 },{
    _id:false
 })

 const preparation=new mongoose.Schema({
    day:{type:Number,
    required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"focus is required"]
    },
    tasks:[{
        type:String,

        required:[true,"Task is required"]
    }]
 })

 const interview=new mongoose.Schema({
    job:{
        type:String,
        required:[true,"job description is required"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:String,
        min:0,
        max:100
    },
    technicalQuestions:[technical],
    behavioralQuestions:[behavioral],
    skillGaps:[skillGap],
    preparationPlan:[preparation],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
 },{
    timestamps:true
 })

 const interviewModel=mongoose.model("InterviewReport",interview)

 module.exports={interviewModel}