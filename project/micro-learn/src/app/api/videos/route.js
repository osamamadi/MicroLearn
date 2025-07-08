// Define an asynchronous GET function to handle incoming requests

export async function GET(request) {
  // Extract the search parameter 'query' from the URL

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  // If no query is provided, return a 400 Bad Request with an empty videos array

  if (!query) {
    return new Response(JSON.stringify({ videos: [] }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Retrieve the YouTube API key from environment variables

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const maxResults = 6;

  // Step 1: Call Search API
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}&type=video&videoDuration=short&key=${YOUTUBE_API_KEY}`;

  try {
    // Fetch search results from YouTube

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    // Extract video items array from the response

    const videoItems = searchData.items || [];
    // Build a comma-separated string of video IDs

    const videoIds = videoItems.map((item) => item.id.videoId).join(",");

    // Step 2: Call Videos API to get view counts
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    // Create a map of videoId => viewCount for quick lookup
    const statsMap = {};
    statsData.items.forEach((item) => {
      statsMap[item.id] = item.statistics.viewCount;
    });

    // --- Step 3: Merge snippet info and statistics into a final videos array ---
    const videos = videoItems.map((item) => {
      const videoId = item.id.videoId;
      return {
        id: videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        views: statsMap[videoId] || "0",
      };
    });
    // Return the merged videos array as JSON response

    return new Response(JSON.stringify({ videos }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("YouTube API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch videos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
