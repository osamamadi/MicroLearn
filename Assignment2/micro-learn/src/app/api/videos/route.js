export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ videos: [] }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const maxResults = 6;

  // Call YouTube Search API
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}&type=video&videoDuration=short&key=${YOUTUBE_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Map only the info you want to send to frontend
    const videos = (data.items || []).map((item) => {
      const videoId = item.id.videoId;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      return {
        id: videoId,
        title: item.snippet.title,
        url: url,
      };
    });

    return new Response(JSON.stringify({ videos }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
