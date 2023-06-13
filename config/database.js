const mongoose=require("mongoose");
require("dotenv").config();

exports.connectDB=()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("DB Connected successfully"))
    .catch((e)=>{
        console.log("Error occured while connecting DB");
        console.log(e.message);
        process.exit(1);
    })
}