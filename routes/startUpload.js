const express=require("express");
const router=express.Router();
const {Worker,isMainThread}=require("worker_threads");
const HashMap = require('hashmap');
const map=new HashMap();
const status=new HashMap();
var arr=[];                         //An array which will contains the information about workers
let workervar;                      //variable which will hold object value of that worker
router.post("/start",((req,res)=>{                                          //API Endpoint for starting the worker
    const userId=req.header("userId");                                      //unique ID of user
    if(userId==undefined){                                                  //checking for userId for identifying user
        res.status(400).send({Error:"Please Provide userId"});
    }
    else if(map.get(userId)==true){                                         //created a hashmap and checking id of that user if it exists so user cant start the same process again
        res.status(400).send({error:"Process is already started"});
    }
    else if(isMainThread){                                                  //checking for the main thread this will control the rest of threads
        const worker=new Worker("./js/worker.js",{workerData:"./temp.csv"});//starting worker for request which will read data from an excel (first argument is the name of file and second argument is the name of csv file) can be provided from request too
        arr.push(worker);
        worker.postMessage({message:"start"});       
        worker.once("message",(message)=>{                                  //messagePassing between workers and main thread
            status.set(userId,"Started");
            map.set(userId,message.threadId)                                //using hashmap for remembring user with thread associated with it
            console.log(message);
        })
        res.status(200).send({Sucess:"Process Started"});
    }
    else{
        res.status(500).send({Error:"Server Error(Process cant be started)"});
    }
}));
router.post("/pause",((req,res)=>{                                          //API Endpoint for pausing the worker
    if(arr[0]==undefined){
        res.status(404).send({Error:"No Process Started"});
    }
    else{
        var userId=req.header("userId");
        if(userId==undefined){
            res.status(404).send({Error:"Please Provide userId"});
        }
        else if(map.get(userId)==undefined){
            res.status(404).send({Error:"No process for this Id"});
        }
        else{
            if(status.get(userId)=="pause"){
                res.status(400).send({Error:"Process is already paused"});
            }
            else{
            workervar=arr[map.get(userId)-1];                                //getting exact worker object from array of worker objects
            workervar.postMessage({message:"pause",threadId:map.get(userId)}) //pausing the worker by passing message
            workervar.once("message",(message)=>{
                if(message.message=="Worker is Paused"){
                    status.set(userId,"pause");
                    res.status(200).send({Success:"Process is paused"});
                }
            })
        }}
    }
}))
router.post("/resume",((req,res)=>{                                          //API Endpoint for pausing the worker
    if(arr[0]==undefined){
        res.status(404).send({Error:"No Process Started"});
    }
    else{
        var userId=req.header("userId");
        if(userId==undefined){
            res.status(404).send({Error:"Please Provide userId"});
        }
        else if(map.get(userId)==undefined){
            res.status(404).send({Error:"No process for this Id"});
        }
        else{
            if(status.get(userId)=="resume"){
                res.status(400).send({Error:"Process is already resumed"});
            }
            else{
            workervar=arr[map.get(userId)-1];                                //getting exact worker object from array of worker objects
            workervar.postMessage({message:"resume",threadId:map.get(userId)}) //pausing the worker by passing message
            workervar.once("message",(message)=>{
                if(message.message=="Worker is Resumed"){
                    status.set(userId,"resume");
                    res.status(200).send({Success:"Process is Resumed"});
                }
            })
        }
    }
    }
}))
router.post("/terminate",((req,res)=>{
    if(arr[0]==undefined){
        res.status(404).send({Error:"No Process Started"});                   //when user requests for terminating a process without starting any process
    }
    else{
        var userId=req.header("userId");
        if(userId==undefined){
            res.status(404).send({Error:"Please Provide userId"});
        }
        else if(map.get(userId)==undefined){                      
            res.status(404).send({Error:"No process for this Id"});
        }
        else{
            workervar=arr[map.get(userId)-1];
            workervar.terminate();                                            //terminating a worker
            map.delete(userId); 
            status.delete(userId);                                              //deleting id of user from map
            res.status(200).send({Success:"Process is terminated"});
        }
    }
}))
module.exports=router;