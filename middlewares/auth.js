const jwt=require("jsonwebtoken");
require("dotenv").config();
// auth, isStudent, isAdmin

exports.auth=(req,res,next)=>{
    try{
        // extract JWT token
        // Other ways to fetch token
        const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing"
            })
        }

        // verify the token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);

            req.user=decode;
            
        }catch(er){
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
        next();
    }catch(e){
        return res.status(401).json({
            success:false,
            message:e.message,
            error:"Something went wrong while verifying the token"
        })
    }
}



exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student"
            })
        }
        next();
    }catch(e){
        return res.status(401).json({
            success:false,
            message:e.message,
            error:"User role is not matching"
        })
    }
}


exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin"
            })
        }
        next();
    }catch(e){
        return res.status(401).json({
            success:false,
            message:e.message,
            error:"User role is not matching"
        })
    }
}