// src/pages/api/spotify.ts
import type { APIRoute } from "astro";

const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const GET: APIRoute = async () => {
  const { access_token } = await getAccessToken();

  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (res.status === 204 || res.status > 400) {
    return new Response(
      JSON.stringify({ isPlaying: false }),
      { status: 200 }
    );
  }

  const song = await res.json();

  return new Response(
    JSON.stringify({
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((a: any) => a.name).join(", "),
      albumImageUrl: song.item.album.images[0].url,
      songUrl: song.item.external_urls.spotify,
    }),
    { status: 200 }
  );
};
