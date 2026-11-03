
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("Connected with Database");
  } catch (err) {
    console.log("Failed to connect with Database", err);
  }
};

const app = express();
const PORT =  process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.post("/test", async (req, res) => {
  try {
    const {prompt} =req.body;
    console.log("Prompt:",prompt);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NexaAI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    const answer = data.candidates[0].content.parts[0].text;
    res.send(answer);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});


//  Humne ek Express API banaya jo user ka prompt Gemini AI ko bhejta hai aur AI ka response return karta hai


// For use http://localhost:8080/test run this in Hoppscotch API.