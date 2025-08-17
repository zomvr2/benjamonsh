// src/lib/spotify.js
// Shared Spotify helper used by the API route and pages
export async function getNowPlaying() {
  try {
    const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
    const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

    if (!client_id || !client_secret || !refresh_token) {
      return { isPlaying: false };
    }

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    if (!tokenRes.ok) return { isPlaying: false };
    const { access_token } = await tokenRes.json();

    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (res.status === 204 || res.status > 400) {
      return { isPlaying: false };
    }

    const song = await res.json();

    return {
      isPlaying: song.is_playing,
      title: song.item?.name,
      artist: song.item?.artists?.map((a) => a.name).join(', '),
      albumImageUrl: song.item?.album?.images?.[0]?.url,
      songUrl: song.item?.external_urls?.spotify,
    };
  } catch (err) {
    return { isPlaying: false };
  }
}
