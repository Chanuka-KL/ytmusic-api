import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();
await ytmusic.initialize();

export default async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query ?q=" });

    const results = await ytmusic.search(q);

    const songs = results
      .filter(r => r.type === "SONG")
      .map(song => ({
        id: song.videoId,
        title: song.name,
        artist: song.artist?.name,
        duration: song.duration,
        thumbnail: song.thumbnails?.[0]?.url
      }));

    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
