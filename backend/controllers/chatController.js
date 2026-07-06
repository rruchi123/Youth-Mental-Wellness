const { GoogleGenAI } = require("@google/genai");

const apiKey = (process.env.GEMINI_API_KEY || "").trim();

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing from backend/.env");
}

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_PROMPT = `
You are a gentle, empathetic AI companion for young people's mental wellness.

Rules:
- Be warm, validating, calm, and non-judgmental.
- Use simple, conversational language.
- Do not diagnose, prescribe treatment, or claim to be a therapist.
- Do not shame, moralize, or lecture.
- Encourage small, practical coping steps when appropriate.
- Ask gentle open-ended questions when helpful.
- Keep replies concise: usually 2 to 5 short paragraphs.
- If the user mentions self-harm, suicide, wanting to die, or immediate danger:
  - Respond with care and urgency.
  - Encourage contacting a trusted person nearby right now.
  - Encourage contacting local emergency services or a crisis helpline.
  - For India, mention Tele-MANAS: 14416 or 1-800-891-4416.
  - Do not provide instructions for self-harm.
- You are a supportive companion, not emergency support.
`;

const sendChatMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A message is required.",
      });
    }

    const conversationHistory = history
      .slice(-10)
      .map((item) => {
        const speaker = item.role === "assistant" ? "Assistant" : "User";
        return `${speaker}: ${item.content}`;
      })
      .join("\n");

    const prompt = `${SYSTEM_PROMPT}

Previous conversation:
${conversationHistory || "No previous messages."}

User: ${message.trim()}

Respond with empathy and warmth.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply = response.text;

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Gemini chat error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get a response right now. Please try again.",
    });
  }
};

module.exports = { sendChatMessage };