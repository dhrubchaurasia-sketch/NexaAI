import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.post("/test", async (req, res) => {
try {
const { prompt } = req.body;


if (!prompt) {
  return res.status(400).json({
    success: false,
    message: "Prompt is required",
  });
}

console.log("Prompt:", prompt);

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
          parts: [{ text: prompt }],
        },
      ],
    }),
  }
);

const data = await response.json();

if (!response.ok) {
  return res.status(response.status).json({
    success: false,
    message: data.error?.message || "Gemini API request failed",
  });
}

const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

res.send(answer || "No response generated");


} catch (err) {
console.error(err);
res.status(500).json({
success: false,
message: err.message,
});
}
});

const startServer = async () => {
try {
await mongoose.connect(process.env.MongoDB_URI);
console.log("Connected with Database");


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


} catch (err) {
console.error("Failed to connect with Database:", err);
process.exit(1);
}
};

startServer();
