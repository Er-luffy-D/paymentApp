const jwt=require('jsonwebtoken')
const JWT_SECRET = require('./config')
const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(411).json({
            message:"Not Verified"
        })
    }
    const token=authHeader.split(' ')[1]
    try{
        const decoded=jwt.verify(token,JWT_SECRET)
        if(decoded.user_id){
            req.userId=decoded.user_id
            next()
        }
    }
    catch(err){
        return res.status(403).json({
            message:"Not Verified"  
        })
    }
}
module.exports={
    authMiddleware
}