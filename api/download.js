import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url || !url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    
    return res.status(200).json({
      success: true,
      title: info.videoDetails.title,
      downloadUrl: format.url
    });
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ error: 'Failed to fetch video. Video may be age-restricted or private.' });
  }
}
