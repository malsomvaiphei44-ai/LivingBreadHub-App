export default async function handler(req, res) {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ reply: "No message received" });
    }

    return res.status(200).json({
      reply: "🙏 Test working! You said: " + message
    });

  } catch (error) {
    return res.status(500).json({
      reply: "Server error"
    });
  }
}
