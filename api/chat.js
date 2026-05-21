export default async function handler(req, res) {
    try {
        const userMessage = req.body.message;

        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: "You are a Christian AI Pastor. Reply with Bible wisdom: " + userMessage
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I am here with you 🙏";

        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ reply: "AI error 🙏" });
    }
    }
