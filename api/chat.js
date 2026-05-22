import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const messages = body?.messages || [];

    const latestMessage =
      messages[messages.length - 1]?.content || "Hello";

    // timeout protection
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 15000)
    );

    const result = await Promise.race([
      model.generateContent(latestMessage),
      timeout,
    ]);

    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      reply: text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      reply: "AI is currently unavailable. Please try again.",
      warning: true,
    });
  }
}
