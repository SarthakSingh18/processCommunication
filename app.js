const express=require("express");
const app=express();
const startUpload=require("./routes/startUpload");
const port=process.env.port||3000;
app.use("/",startUpload);
app.use("*",(req,res)=>{
    res.status(404).send({error:"You hit the wrong endpoint"});
})
app.listen(port,()=>{
    console.log(`listening at ${port}`);
})