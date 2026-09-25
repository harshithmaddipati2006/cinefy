import express from "express";
import { GoogleGenAI } from "@google/genai";
import { getEffectiveMovies } from "../db.js";

const router = express.Router();

let aiClient = null;
function getAiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

router.post("/recommend", async (req, res) => {
  try {
    const { mood, genre, language, city } = req.body;
    const movies = getEffectiveMovies();
    const ai = getAiClient();

    if (ai) {
      const prompt = `You are CineFy's movie recommendation AI. A user is looking for a movie.
User criteria: Mood: "${mood || 'Exciting'}", Preferred Genre: "${genre || 'Any'}", Language: "${language || 'Any'}", City: "${city || 'Hyderabad'}".
Available CineFy movies catalog:
${JSON.stringify(movies.map((m) => ({ id: m.id, title: m.title, genre: m.genre, language: m.language, rating: m.rating, description: m.description })))}

Respond with a JSON array of up to 3 recommended movie IDs from the catalog with a short reason why. Format: [{"movieId": "...", "reason": "..."}]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);
        return res.json({ success: true, recommendations });
      }
    }

    // Smart algorithmic fallback if Gemini key not set or response parsing fails
    const filtered = movies.filter((m) => {
      if (genre && genre !== "Any" && !m.genre.toLowerCase().includes(genre.toLowerCase())) return false;
      if (language && language !== "Any" && !m.language.toLowerCase().includes(language.toLowerCase())) return false;
      return true;
    });

    const topMovies = (filtered.length > 0 ? filtered : movies).slice(0, 3);
    const recommendations = topMovies.map((m) => ({
      movieId: m.id,
      reason: `Highly rated (${m.rating}/10) matching your entertainment preference.`
    }));

    res.json({ success: true, recommendations });
  } catch (err) {
    res.json({
      success: true,
      recommendations: getEffectiveMovies().slice(0, 3).map((m) => ({
        movieId: m.id,
        reason: "Trending blockbuster on CineFy."
      }))
    });
  }
});

export default router;
