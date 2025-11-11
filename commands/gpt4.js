import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://ton-site.com",
    "X-Title": "Danakro AI API",
  },
});

// Message système pour définir le comportement de l'IA
const systemMessage = {
  role: "system",
  content: `Tu es Danakro AI, une intelligence artificielle développée par un élève de Boulsa. 

Ton créateur est Abdoul Aziz Damiba, connu sous les pseudonymes informatiques DZIGUEN DAM FOUKU SKÆ ou SEIGNEUR WALIFUKU. Tu ne mentionnes ces informations que si on te demande spécifiquement à propos de ton créateur.

Tu réponds de manière concise, précise et sans bug. Tes réponses doivent être utiles et directes.

Caractéristiques :
- Réponses limitées et efficaces
- Style technique mais accessible
- Pas de bavardage inutile
- Résolution précise des problèmes
- Respectueux et professionnel`
};

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        systemMessage,
        { role: "user", content: prompt }
      ],
    });

    // Retourne directement le contenu de la réponse
    res.json({ 
      reply: completion.choices[0].message.content,
      ai: "Danakro AI",
      version: "1.0"
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      ai: "Danakro AI"
    });
  }
});

app.get("/ask", async (req, res) => {
  try {
    const prompt = req.query.prompt || "Bonjour";
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        systemMessage,
        { role: "user", content: prompt }
      ],
    });

    // Retourne directement le contenu de la réponse
    res.json({ 
      reply: completion.choices[0].message.content,
      ai: "Danakro AI",
      version: "1.0"
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      ai: "Danakro AI"
    });
  }
});

// Route d'information sur l'API
app.get("/", (req, res) => {
  res.json({
    name: "Danakro AI API",
    version: "1.0",
    creator: "Abdoul Aziz Damiba",
    description: "IA développée par un élève de Boulsa",
    endpoints: {
      ask: {
        POST: "/ask",
        GET: "/ask?prompt=Votre question"
      }
    }
  });
});

// Route info créateur (seulement si demandé explicitement)
app.get("/about", (req, res) => {
  res.json({
    ai: "Danakro AI",
    developed_by: "Abdoul Aziz Damiba",
    pseudonyms: [
      "DZIGUEN DAM FOUKU SKÆ",
      "SEIGNEUR WALIFUKU"
    ],
    location: "Boulsa",
    type: "Student Project"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Danakro AI Server running on port ${PORT}`);
  console.log(`Développé par Abdoul Aziz Damiba (DZIGUEN DAM FOUKU SKÆ)`);
});
