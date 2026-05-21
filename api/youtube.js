export default async function handler(req, res) {
  try {
    const query = req.query.q || "worship music";

    const API_KEY = process.env.YOUTUBE_API_KEY;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
        query
      )}&key=${API_KEY}`
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch worship tracks",
    });
  }
}
