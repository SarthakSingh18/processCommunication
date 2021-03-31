const {workerData,parentPort,threadId}=require('worker_threads');
var data=[];
run();
function run(){
var fs=require("fs");
var readStream=fs.createReadStream(workerData);                             //creating readstream of a file provided in argument
parentPort.on("message",(message)=>{
    if(message.message=="start"){                                           //checking message from user if it is start pause or terminate
        parentPort.postMessage({message:"Work Started",threadId:threadId});
        readStream.on('data',function(chunk){
            data=chunk;
        });
    }
    else if(message.message=="pause"){
        if(message.threadId==threadId){                                     //checking if message is passed to correct thread
            readStream.pause();                                             //pausing a readstream of csv file
            parentPort.postMessage({message:"Worker is Paused"});
        }
        else{
            parentPort.postMessage({message:"error"})
        }
    }
    else if(message.message=="resume"){
        if(message.threadId==threadId){
            readStream.resume();                                            //resuming a readStream of csv file
            parentPort.postMessage({message:"Worker is Resumed"});
        }
        else{
            parentPort.postMessage({message:"error"})
        }
    }
    else{
            parentPort.postMessage({message:"error"});
        }
    readStream.on("error",()=>{
    parentPort.postMessage({message:"error while reading file"});  
    
    readStream.on('end',()=>{
        console.log("done reading file");
        
    })
})
});
}

