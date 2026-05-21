import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    console.error(error);

    return res.status(500).json({
      reply:
        "I am currently reflecting quietly on the Word. Please try again shortly.",
    });
  }
}
