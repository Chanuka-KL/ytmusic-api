import pkg from "ytmusic-api";
const YTMusic = pkg.default ?? pkg;

let ytmusic;

async function getYT() {
  if (!ytmusic) {
    ytmusic = new YTMusic();
    await ytmusic.initialize();
  }
  return ytmusic;
}

export default async function handler(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query ?q=" });

    const yt = await getYT();
    const results = await yt.search(q);

    
    const first = results.find(r => r.type === "SONG" || r.type === "VIDEO");

    if (!first) return res.status(404).json({ error: "No result found" });

    res.status(200).json({
      id: first.videoId,
      title: first.name,
      artist: first.artist?.name ?? "Unknown",
      album: first.album?.name ?? null,
      duration: first.duration,
      url: `https://music.youtube.com/watch?v=${first.videoId}`,
      thumbnails: first.thumbnails?.map(t => t.url) ?? []
    });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
