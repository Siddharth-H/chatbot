const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "https://your-vercel-domain.vercel.app"
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load from .env
});


app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or whatever model you’re using
      messages: [{ role: "user", content: message }],
    });

    // SAFELY check if choices exist
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


app.listen(3001, () => console.log("Server running on port 3001"));
