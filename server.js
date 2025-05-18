require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const GROQ_APIKEY = process.env.GROQ_APIKEY;

app.post('/api/generate-questions', async (req, res) => {
  const { topic, num, difficulty } = req.body;

  const prompt = `Generate ${num} multiple-choice questions with 4 options each on the topic "${topic}".
Each question should be of ${difficulty} difficulty level.
Provide the correct answer index (0-3) for each question in JSON format like this:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1
  }
]`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_APIKEY}`
      },
      body: JSON.stringify({
        model: "llama-3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
