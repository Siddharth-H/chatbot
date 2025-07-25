const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
const allowedOrigins = process.env.ALLOWED_URLS?.split(",") || [];

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [{ role: "user", content: message }],
    });

    if (completion && completion.choices && completion.choices.length > 0) {
      res.json({ reply: completion.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Invalid response from OpenAI API" });
    }
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});

// Root page
app.get("/", (req, res) => {
  res.send("<h2>✅ AI Chatbot Server is Running</h2>");
});

app.listen(3001, () => console.log("Server running on port 3001"));
