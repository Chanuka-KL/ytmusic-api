import pkg from "ytmusic-api";
const YTMusic = pkg.default ?? pkg; // works for CommonJS + ESM

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

    // include SONG + VIDEO types
    const songs = results
      .filter(r => r.type === "SONG" || r.type === "VIDEO")
      .map(item => ({
        id: item.videoId,
        title: item.name,
        type: item.type,
        artist: item.artist?.name,
        duration: item.duration,
        thumbnail: item.thumbnails?.[0]?.url
      }));

    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
