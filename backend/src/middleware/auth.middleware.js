const jwt=require('jsonwebtoken')
const blacklist = require('../model/tokenblacklist.model');
async function authUser(req,res,next){
const token=req.cookies.token;

if(!token)
{
    return res.status(400).json({
        message:"Token not provided"
    })
}
const iftokenBlacklisted=await blacklist.findOne({
    token
})

if(iftokenBlacklisted)
{
    return res.status(401).json({
        message:"token is blacklisted"
    })
}
try{
    const decoded=jwt.verify(token,process.env.JWT || 'secretkey');
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