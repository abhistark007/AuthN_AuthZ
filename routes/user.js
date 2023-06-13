const express=require("express");
const router=express.Router();

// import controllers
const {login,signup}=require("../controllers/Auth");
const {auth,isStudent,isAdmin}=require("../middlewares/auth");

// handle controllers
router.post("/login",login);
router.post("/signup",signup);


router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"This is a protected routes for test"
    })
})

// Protected Route
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected Route for student"
    });
})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected Route for Admin" 
    });
})

module.exports=router;