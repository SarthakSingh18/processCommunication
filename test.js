const fs=require("fs");
const readStream=fs.createReadStream("./temp.csv");
const writeStream=fs.createWriteStream("./temp.text");
readStream.on("data",(data)=>{
    const canContinue=writeStream.write(data);
    if(!canContinue){
        console.log(canContinue);
        readStream.pause();
        console.log("paused");
    }
    writeStream.once("drain",()=>{
        console.log("drained");
         readStream.resume();
    })
})