const jwt=require('jsonwebtoken')
const tokenblacklist=require('../model/tokenblacklist.model');
const blacklist = require('../model/tokenblacklist.model');
async function authUser(req,res,next){
const token=req.cookies.token;

if(!token)
{
    return res.status(400).json({
        message:"Token not provided"
    })
}
const iftokenBlacklisted=await blacklistModel.findOne({
    token
})

if(iftokenBlacklisted)
{
    return res.status(401).json({
        message:"token is blacklisted"
    })
}
try{
    const decoded=jwt.verify(token,process.env.JWT);
    req.user=decoded
    next()
}
catch(err){
    return res.status(400).json({
        message:"Invakid Token"
    })
}
}
module.exports={authUser}