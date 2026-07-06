const { GoogleGenAI } = require("@google/genai");
const MusicMood = require("../models/MusicMood");

const apiKey = (process.env.GEMINI_API_KEY || "").trim();

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing from backend/.env");
}

const ai = new GoogleGenAI({ apiKey });

const analyzeMusicMood = async (req, res) => {
  try {
    const { songTitle, artist, whyResonates } = req.body;

    if (!songTitle || !songTitle.trim()) {
      return res.status(400).json({
        success: false,
        message: "Song title is required.",
      });
    }

    const prompt = `
You are a gentle, empathetic mental-wellness companion.

A user shared this song:
Song: "${songTitle.trim()}"
Artist: "${artist ? artist.trim() : "Not provided"}"
Their reflection: "${whyResonates ? whyResonates.trim() : "Not provided"}"

Respond warmly and without judging their music choice.

Return ONLY valid JSON in this exact structure:
{
  "insight": "2 to 3 short supportive sentences",
  "detected_mood": "one or two simple words, such as hopeful, calm, nostalgic, sad, anxious, or energetic",
  "suggestions": [
    {
      "title": "song title",
      "artist": "artist name",
      "mood": "short mood label"
    },
    {
      "title": "song title",
      "artist": "artist name",
      "mood": "short mood label"
    },
    {
      "title": "song title",
      "artist": "artist name",
      "mood": "short mood label"
    }
  ]
}

Do not diagnose, prescribe treatment, or claim to be a therapist.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    let analysis;

    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error("Gemini returned an invalid analysis format.");
    }

    const savedMusicMood = await MusicMood.create({
      user: req.user._id,
      songTitle: songTitle.trim(),
      artist: artist ? artist.trim() : "",
      whyResonates: whyResonates ? whyResonates.trim() : "",
      detectedMood: analysis.detected_mood || "reflective",
      aiInsight: analysis.insight || "",
      suggestedSongs: Array.isArray(analysis.suggestions)
        ? analysis.suggestions.slice(0, 3)
        : [],
    });

    return res.status(201).json({
      success: true,
      message: "Music mood analyzed successfully.",
      analysis: {
        insight: savedMusicMood.aiInsight,
        detected_mood: savedMusicMood.detectedMood,
        suggestions: savedMusicMood.suggestedSongs,
      },
      musicMood: savedMusicMood,
    });
  } catch (error) {
    console.error("Music mood error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze this music mood right now. Please try again.",
    });
  }
};

const getMyMusicMoodHistory = async (req, res) => {
  try {
    const musicMoods = await MusicMood.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: musicMoods.length,
      musicMoods,
    });
  } catch (error) {
    console.error("Music history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch music history.",
    });
  }
};

module.exports = {
  analyzeMusicMood,
  getMyMusicMoodHistory,
};