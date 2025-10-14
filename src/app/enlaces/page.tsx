"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Album, ExternalIDS, Item, Track, Welcome } from "@/types/SpotifyStream"

import { useState, useEffect } from "react";

export default function Enlaces() {
  const [song, setSong] = useState<Item | null>(null);

  const fetchSong = async () => {
    const res = await fetch("https://beta-api.stats.fm/api/v1/users/benjamonsh/streams/current");
    const data = (await res.json()) as Welcome;
    if (data?.item) setSong(data.item)
  };

  const favoriteSongs = [
    "6y0HWXD9L1VocIivzrznIT", // Akellas - FaceBrooklyn
    "3et5CLQNao5XFTUdC7x7fk", // INDOrrrr - Abrildefresa
    "3fljQiJN8UnHjkqa01SpwT", // KIKIBOYYYYY - Abrildefresa
    "6nEfUHrjohafrLeq884vyr", // Icono - Abrildefresa
    "6VYe3CyriXVeFmZaORgQK7", // Escala - Abrildefresa
    "1jAXoJOn5ulibhT4aMxW21", // 29/2 - Abrildefresa
  ];

  useEffect(() => {
    fetchSong();

    const refreshInterval = setInterval(fetchSong, 15000);
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <>
      <Header />
      <main
        className="max-w-[512px] mx-auto py-12 px-5 flex flex-col"
      >
        {
          song && (
            <section className="flex flex-col gap-[10px]">
              <p className="font-bold text-lg text-center">
                benjamonsh está escuchando ahora
              </p>
              <div className="bg-white border border-[#CCC] rounded-2xl">
                <div className="flex flex-row gap-[10px] bg-[#121212] rounded-2xl p-2.5 items-center">
                  <img
                    src={song.track.albums[0].image}
                    alt={song.track.name}
                    width="50"
                    height="50"
                    className="rounded-lg"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-white font-bold text-lg leading-6 line-clamp-1 text-ellipsis">
                      {song.track.name}
                    </p>
                    <p className="text-[#A3A3A3] font-normal text-base leading-5 line-clamp-1 text-ellipsis">
                      {song.track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                  <a href={`https://open.spotify.com/track/${song.track.externalIds.spotify[0]}`} target="_blank" className="ml-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="#1DB954"
                      className="icon icon-tabler icons-tabler-filled icon-tabler-brand-spotify"
                    >
                      <>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-2.168 11.605c-1.285 -1.927 -4.354 -2.132 -6.387 -.777a1 1 0 0 0 1.11 1.664c1.195 -.797 3.014 -.675 3.613 .223a1 1 0 1 0 1.664 -1.11m1.268 -3.245c-2.469 -1.852 -5.895 -2.187 -8.608 -.589a1 1 0 0 0 1.016 1.724c1.986 -1.171 4.544 -.92 6.392 .465a1 1 0 0 0 1.2 -1.6m1.43 -3.048c-3.677 -2.298 -7.766 -2.152 -10.977 -.546a1 1 0 0 0 .894 1.788c2.635 -1.317 5.997 -1.437 9.023 .454a1 1 0 1 0 1.06 -1.696" />
                      </>
                    </svg>
                  </a>
                </div>
                {favoriteSongs.find(
                  (fav) =>
                    fav === song.track.externalIds.spotify[0],
                ) && (
                    <div className="flex flex-row gap-2 p-[15px] items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6C48C5"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />
                      </svg>
                      <div>
                        <p className="font-black text-[15px] leading-4">
                          Joyita Oficial
                        </p>
                        <p className="font-medium text-[#A3A3A3] text-[12px] leading-4">
                          de las fav del momento de benjamonsh
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </section>
          )
        }
        <section className="flex flex-col gap-4 mt-8">
          <h2 className="font-bold text-3xl text-center">Mis Enlaces</h2>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="https://github.com/zomvr2"
                target="_blank"
                className="flex flex-row items-center bg-white border border-[#CCC] rounded-2xl hover:bg-[#F9F7FF] cursor-pointer transition-all"
              >
                <div className="bg-black p-[15px] rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-brand-github"
                  ><path stroke="none" d="M0 0h24v24H0z" fill="none"
                  ></path><path
                    d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z"
                  ></path></svg
                  >
                </div>
                <span className="ml-5 mr-5 font-medium text-2xl">GitHub</span>
              </a>
            </li>
            <li>
              <a
                href="https://open.spotify.com/user/0h5li5o0jmc9r1pw12lxt4jvn"
                target="_blank"
                className="flex flex-row items-center bg-white border border-[#CCC] rounded-2xl hover:bg-[#F9F7FF] cursor-pointer transition-all"
              >
                <div className="bg-black p-[15px] rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="#FFF"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-brand-spotify"
                  ><path stroke="none" d="M0 0h24v24H0z" fill="none"
                  ></path><path
                    d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-2.168 11.605c-1.285 -1.927 -4.354 -2.132 -6.387 -.777a1 1 0 0 0 1.11 1.664c1.195 -.797 3.014 -.675 3.613 .223a1 1 0 1 0 1.664 -1.11m1.268 -3.245c-2.469 -1.852 -5.895 -2.187 -8.608 -.589a1 1 0 0 0 1.016 1.724c1.986 -1.171 4.544 -.92 6.392 .465a1 1 0 0 0 1.2 -1.6m1.43 -3.048c-3.677 -2.298 -7.766 -2.152 -10.977 -.546a1 1 0 0 0 .894 1.788c2.635 -1.317 5.997 -1.437 9.023 .454a1 1 0 1 0 1.06 -1.696"
                  ></path></svg
                  >
                </div>
                <span className="ml-5 mr-5 font-medium text-2xl">Spotify</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/benjamonsh/"
                target="_blank"
                className="flex flex-row items-center bg-white border border-[#CCC] rounded-2xl hover:bg-[#F9F7FF] cursor-pointer transition-all"
              >
                <div className="bg-black p-[15px] rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="#FFF"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-brand-instagram"
                  ><path stroke="none" d="M0 0h24v24H0z" fill="none"
                  ></path><path
                    d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-8a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-4 5a4 4 0 0 0 -3.995 3.8l-.005 .2a4 4 0 1 0 4 -4m4.5 -1.5a1 1 0 0 0 -.993 .883l-.007 .127a1 1 0 0 0 1.993 .117l.007 -.127a1 1 0 0 0 -1 -1"
                  ></path></svg
                  >
                </div>
                <span className="ml-5 mr-5 font-medium text-2xl">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:zodev@proton.dev"
                target="_blank"
                className="flex flex-row items-center bg-white border border-[#CCC] rounded-2xl hover:bg-[#F9F7FF] cursor-pointer transition-all"
              >
                <div className="bg-black p-[15px] rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="#FFF"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-mail"
                  ><path stroke="none" d="M0 0h24v24H0z" fill="none"
                  ></path><path
                    d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z"
                  ></path><path
                    d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z"
                  ></path></svg
                  >
                </div>
                <span className="ml-5 mr-5 font-medium text-2xl">Contáctame</span>
              </a>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}