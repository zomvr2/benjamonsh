// src/pages/api/spotify.ts
import type { APIRoute } from "astro";
import { getNowPlaying } from "../../lib/spotify";

export const GET: APIRoute = async () => {
  const data = await getNowPlaying();
  return new Response(JSON.stringify(data), { status: 200 });
};
