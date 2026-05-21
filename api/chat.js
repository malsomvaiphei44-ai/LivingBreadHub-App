import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({
        reply: "Method not allowed",
      });
    }

    // Gemini setup
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Read messages from frontend
    const messages = req.body.messages || [];

    // Get latest user message
    const latestMessage =
      messages[messages.length - 1]?.content || "Hello";

    // Generate AI response
    const result = await model.generateContent(latestMessage);

    const response = await result.response;
    const text = response.text();

    // Send response back
    return res.status(200).json({
      reply: text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      reply:
        "The AI pastor is currently praying quietly. Please try again shortly.",
      warning: true,
    });
  }
}
