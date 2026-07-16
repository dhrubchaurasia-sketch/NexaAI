import express from "express";
import Thread from "../models/Thread.js";
import { randomUUID } from "crypto";
import  getGeminiAPIResponse from "../utils/gemini.js"
const router = express.Router();


// Test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: randomUUID(),
      title: "Testing New Thread",
    });

    const savedThread = await thread.save();

    res.status(201).json({
      success: true,
      data: savedThread,
    });

  } catch (err) {
    console.log("FULL ERROR:", err);

    res.status(500).json({error: err.message || "Failed to save in DB",});
  }
});

// Get all Threads 
router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });

    res.json(threads);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || "Failed to fetch threads",
    });
  }
});



router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try{
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages || []);
  }catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || "Failed to fetch chats",
    });
  }
});


// Delete Thread
router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;
    try{
        const deleteThread= await Thread.findOneAndDelete({threadId});
        if(!deleteThread){
           return res.status(404).json({error:"Thread could not be deleted"});
        }
       return res.status(200).json({success:true,message:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({
          error: err.message || "Failed to delete thread",
        });
    }
});

router.post("/chat", async(req,res)=>{
    const {threadId,message} = req.body;
    if(!threadId || !message){
        return res.status(400).json({error:"Missing required fields"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            // Create a new Thread
            thread = new Thread({
                threadId,
                title:message, 
                messages:[{role:"user",content:message}]
            });
        }else{
            thread.messages.push({role:"user",content:message});
        }

        const assistantReply = await getGeminiAPIResponse(message);
        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt = new Date();
        await thread.save()
        res.json({reply:assistantReply});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Something went wrong"});
    }
})


export default router;