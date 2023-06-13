const User=require("../models/User");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
 
exports.login=async(req,res)=>{
    try{
        // get data
        const {email,password}=req.body;
        // check if all details are filled
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are necessary"
            })
        }

        let existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"Email doesn't exists"
            })
        }
        const payload={
            email:existingUser.email,
            id:existingUser._id,
            role:existingUser.role
        };
        // check is password is correct and create JWT
        if(await bcrypt.compare(password,existingUser.password)){
            let token=jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                }
            );
            existingUser=existingUser.toObject();
            existingUser.token=token;
            existingUser.password=undefined; //doesn;t remove from DB only from this object
            
            // creating cookie
            const options={
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            };
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                existingUser,
                message:"User logged in successfully"
            });

            // res.status(200).json({
            //     success:true,
            //     message:"user Logged in successfully",
            //     token,
            //     existingUser
            // })
        }else{
            return res.status(400).json({
                success:false,
                message:"Password incorrect"
            })
        }


    }catch(e){
        res.status(500).json({
            success:false,
            error:e.message
        })
    }
}

exports.signup=async(req,res)=>{
    try{
        // get data
        const {name,email,password,role}=req.body;

        // check if user already exists
        const existingUser=await User.findOne({email});

        // if user exists
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"email already in use",
                existingUser
            });
        }
        // if user doesn't exists
        
        // secure password
        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }catch(er){
            return res.status(500).json({
                success:false,
                message:er.message,
                error:"Error in hashing password"
            })
        }

        // create entry for user
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });



        res.status(200).json({
            success:true,
            message:"user created successfully"
        })






    }catch(e){
        res.status(500).json({
            success:false,
            error:e.message
        })
    }
}
