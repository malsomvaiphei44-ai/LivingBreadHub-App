export default async function handler(req, res) {
  try {
    const query = req.query.q || "worship music";

    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Missing YouTube API key in environment variables",
      });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
        query
      )}&key=${API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "YouTube API request failed",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("YouTube Error:", error);

    return res.status(500).json({
      error: "Failed to fetch YouTube videos",
    });
  }
}
