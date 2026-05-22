import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        reply: "Missing Gemini API key in environment variables.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const messages = req.body.messages || [];

    const latestMessage =
      messages[messages.length - 1]?.content || "Hello";

    const result = await model.generateContent(latestMessage);

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      reply: text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      reply: "AI service error. Please try again later.",
    });
  }
      }
