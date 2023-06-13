const express=require("express");
const app=express();

require("dotenv").config();
const PORT=process.env.PORT || 3000;


// cookie-parser
const cookieParser=require("cookie-parser");
app.use(cookieParser());

app.use(express.json());


// DB connect
const {connectDB}=require("./config/database");
connectDB();


// routes import and mount
const user=require("./routes/user");
app.use("/api/v1",user);

// server start
app.listen(PORT,()=>{
    console.log("Server Started at ",PORT);
})