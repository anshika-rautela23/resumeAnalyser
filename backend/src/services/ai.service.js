const { GoogleGenAI }=require('@google/genai')
const {z}=require('zod')

const ai=new GoogleGenAI({
    apiKey:process.env.GoogleGenAIApi_key
})

const interviewSchema=z.object({
    matchScore:z.number().describe("A score between 0 and 100 indicating how well the candidate profile is"),
    technicalQuestions:z.array(z.object({
        question:z.string().describe("the technical question that can be asked in interview"),
        intention:z.string().describe("the intention of interviewer behind asking this question"),
        answer:z.string().describe("how to answer this question,what points to cover, what approach")
    })).min(1).describe("questions that may be asked in interview"),
    behavioralQuestions:z.array(z.object({
        question:z.string().describe("the technical question that can be asked in interview"),
        intention:z.string().describe("the intention of interviewer behind asking this question"),
        answer:z.string().describe("how to answer this question,what points to cover, what approach")
    })).min(1).describe("questions that may be asked in interview"),
    skillGaps:z.array(z.object({
        skill:z.string().describe("The skill which the candidate is lagging"),
        severity:z.enum(["low","medium","high"]).describe("The severity of skill gap,")
    })).describe("List of skill gap in candidate's profile"),
     preparationPlan:z.array(z.object({
        day:z.number().describe("The day number is the preparation plan"),
        focus:z.string().describe("The main focus on this day"),
        tasks:z.array(z.string()).describe("The main tasks on this day")
    })).min(1).describe("Day wise preparation plan for candidate")
})

const interviewJsonSchema={
    type:"object",
    additionalProperties:false,
    required:["matchScore","technicalQuestions","behavioralQuestions","skillGaps","preparationPlan"],
    properties:{
        matchScore:{type:"number",minimum:0,maximum:100},
        technicalQuestions:{type:"array",minItems:1,items:{
            type:"object",additionalProperties:false,required:["question","intention","answer"],
            properties:{question:{type:"string"},intention:{type:"string"},answer:{type:"string"}}
        }},
        behavioralQuestions:{type:"array",minItems:1,items:{
            type:"object",additionalProperties:false,required:["question","intention","answer"],
            properties:{question:{type:"string"},intention:{type:"string"},answer:{type:"string"}}
        }},
        skillGaps:{type:"array",items:{
            type:"object",additionalProperties:false,required:["skill","severity"],
            properties:{skill:{type:"string"},severity:{type:"string",enum:["low","medium","high"]}}
        }},
        preparationPlan:{type:"array",minItems:1,items:{
            type:"object",additionalProperties:false,required:["day","focus","tasks"],
            properties:{day:{type:"number"},focus:{type:"string"},tasks:{type:"array",items:{type:"string"}}}
        }}
    }
}

async function generateInterviewReport({resume,selfDescription,jobDescription}) {
    let lastError

    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            const response=await ai.models.generateContent({

         model:"gemini-3.6-flash",
        contents:`Create a detailed interview preparation report using these details:
    Resume: ${resume}
    Self description: ${selfDescription}
    Job description: ${jobDescription}

    Return a complete JSON report with every field in the response schema.
    Do not return a short summary or omit any field.
    Include:
    - A match score from 0 to 100.
    - Exactly 5 detailed technical questions with the intention and a thorough answer for each.
    - Exactly 5 detailed behavioral questions with the intention and a thorough answer for each.
    - Every important skill gap and its severity.
    - A detailed 7-day preparation plan with specific tasks for each day.
    Make the answers practical and specific to the resume and job description.`,
                config:{
                    responseMimeType:"application/json",
                    responseJsonSchema:interviewJsonSchema,
                    temperature:0.2,
                    maxOutputTokens:12000
                }
            })

            return interviewSchema.parse(JSON.parse(response.text))
        } catch (error) {
            lastError = error
        }
    }

    throw new Error(`AI returned an incomplete interview report: ${lastError.message}`)
} 


module.exports=generateInterviewReport