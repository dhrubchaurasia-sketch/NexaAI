import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role:{
        type:String,
        enum:["user","assistant"],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

// Message Schema bn gya hain yeh upar.


// Thread Schema bn gya hain yeh niche.
const ThreadSchema = new mongoose.Schema({
    threadId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        default:"New Chat"
    },
    messages:[MessageSchema],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
});
export default mongoose.model("Thread", ThreadSchema);