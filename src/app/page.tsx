import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSection from "@/components/home/BlogSection";

export const metadata = {
  title: "Inicio",
  description: "¡Hola! Soy Benjamin Delgado, conocido como Benjamonsh. Desarrollo web y de apps móviles para hacer crecer tu negocio 🚀. Creo soluciones digitales que impulsan tu negocio y te ayudan a destacar.",
  openGraph: {
    title: "Benjamonsh - Desarrollo Web y Apps Móviles",
    description: "¡Hola! Soy Benjamin Delgado, conocido como Benjamonsh. Desarrollo web y de apps móviles para hacer crecer tu negocio 🚀.",
    url: "https://benjamonsh.vercel.app",
    type: "website",
  },
  twitter: {
    title: "Benjamonsh - Desarrollo Web y Apps Móviles",
    description: "¡Hola! Soy Benjamin Delgado, conocido como Benjamonsh. Desarrollo web y de apps móviles para hacer crecer tu negocio 🚀.",
  },
};

export default function Home() {
  return (
    <>
      <Header />

      <main className="px-5 md:px-[60px]">
        <section className="max-w-[1024px] mx-auto py-12 flex flex-col gap-7">
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-4xl">¡Hola! Soy Benjamín,</h1>
            <h2 className="font-black text-6xl">
              Desarrollo web y de apps móviles para hacer <span
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">crecer</span
              > tu negocio 🚀
            </h2>
            <p className="font-medium text-lg text-[#333333] mt-1">
              Creo soluciones digitales que impulsan tu negocio y te ayudan a
              destacar.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3.5">
            <a
              href="/#contacto"
              className="flex w-full md:w-fit items-center gap-1 font-medium bg-black text-white px-7 py-4 md:py-2 rounded-xl text-lg text-center hover:bg-blue-950 cursor-pointer transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-bubble-text"
              ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path
                d="M7 10h10"></path><path d="M9 14h5"></path><path
                  d="M12.4 3a5.34 5.34 0 0 1 4.906 3.239a5.333 5.333 0 0 1 -1.195 10.6a4.26 4.26 0 0 1 -5.28 1.863l-3.831 2.298v-3.134a2.668 2.668 0 0 1 -1.795 -3.773a4.8 4.8 0 0 1 2.908 -8.933a5.33 5.33 0 0 1 4.287 -2.16"
                ></path>
              </svg>
              Habla conmigo</a
            >
            <div className="flex flex-row gap-3.5">
              <a
                href="/#proyectos"
                className="flex w-full md:w-fit items-center gap-1 font-medium bg-white text-black px-7 py-4 md:py-2 rounded-xl text-lg border border-[#CCC] text-center hover:bg-[#F9F7FF] cursor-pointer transition-all"
              >
                Ver proyectos</a
              >
            </div>
          </div>
        </section>

        <section id="proyectos" className="max-w-[1024px] mx-auto py-12 flex flex-col gap-7">
          <div>
            <h3 className="text-lg text-center md:text-left text-blue-800 font-bold">Proyectos</h3>
            <h2 className="text-3xl text-center md:text-left font-bold">Explora mi trabajo y las soluciones que he creado.</h2>
          </div>
          <section className="flex flex-col md:grid md:grid-cols-3 gap-4">
            <article className="bg-white border border-[#CCCCCC] rounded-2xl hover:bg-[#F9F7FF] cursor-pointer transition-all hover:scale-105">
              <img src="/playbox.png" alt="Playbox App Screenshot" />
              <div className="p-5 flex flex-col gap-1">
                <p className="font-semibold text-3xl">Playbox</p>
                <p className="text-lg">Sitio Web de Películas</p>
                <div className="flex flex-row gap-3.5 mt-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C48C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-nextjs"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 15v-6l7.745 10.65a9 9 0 1 1 2.255 -1.993" /><path d="M15 12v-3" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C48C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-tailwind"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.667 6c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 2 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968zm-4 6.5c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 1.975 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968z" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C48C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-vercel"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 19h18l-9 -15z" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C48C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-figma"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" /><path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" /></svg>
                </div>
              </div>
            </article>
            <article className="bg-white border border-[#CCCCCC] rounded-2xl hover:bg-[#F9F7FF] cursor-pointer transition-all hover:scale-105">
              <img src="/echo.png" alt="Playbox App Screenshot" />
              <div className="p-5 flex flex-col gap-1">
                <p className="font-semibold text-3xl">Echo</p>
                <p className="text-lg">App Móvil de Música</p>
                <div className="flex flex-row gap-3.5 mt-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C48C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-react-native"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.357 9c-2.637 .68 -4.357 1.845 -4.357 3.175c0 2.107 4.405 3.825 9.85 3.825c.74 0 1.26 -.039 1.95 -.097" /><path d="M9.837 15.9c-.413 -.596 -.806 -1.133 -1.18 -1.8c-2.751 -4.9 -3.488 -9.77 -1.63 -10.873c1.15 -.697 3.047 .253 4.974 2.254" /><path d="M6.429 15.387c-.702 2.688 -.56 4.716 .56 5.395c1.783 1.08 5.387 -1.958 8.043 -6.804c.36 -.67 .683 -1.329 .968 -1.978" /><path d="M12 18.52c1.928 2 3.817 2.95 4.978 2.253c1.85 -1.102 1.121 -5.972 -1.633 -10.873c-.384 -.677 -.777 -1.204 -1.18 -1.8" /><path d="M17.66 15c2.612 -.687 4.34 -1.85 4.34 -3.176c0 -2.11 -4.408 -3.824 -9.845 -3.824c-.747 0 -1.266 .029 -1.955 .087" /><path d="M8 12c.285 -.66 .607 -1.308 .968 -1.978c2.647 -4.844 6.253 -7.89 8.046 -6.801c1.11 .679 1.262 2.706 .56 5.393" /><path d="M12.26 12.015h-.01c-.01 .13 -.12 .24 -.26 .24a.263 .263 0 0 1 -.25 -.26c0 -.14 .11 -.25 .24 -.25h-.01c.13 -.01 .25 .11 .25 .24" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C48C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-supabase"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 14h8v7l8 -11h-8v-7z" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C48C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-figma"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" /><path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" /></svg>
                </div>
              </div>
            </article>
            <article className="bg-white border border-[#CCCCCC] rounded-2xl flex items-center justify-center gap-2 p-5 text-[#6C48C5] hover:bg-[#F9F7FF] cursor-pointer transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" /><path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" /><path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" /><path d="M8.56 20.31a9 9 0 0 0 3.44 .69" /><path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" /><path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" /><path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" /><path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
              <p>Ver todos mis proyectos</p>
            </article>
          </section>
          <p className="font-medium text-lg">¡Tu proyecto podría estar aquí! <a href="/#contacto" className="text-[#6C48C5]">Cuéntame tu idea.</a></p>
        </ section>

        <BlogSection />

        <section id="contacto" className="max-w-[1024px] mx-auto flex flex-col gap-7 py-12">
          <div>
            <h3 className="text-lg text-center md:text-left text-blue-800 font-bold">Contacto</h3>
            <h2 className="text-3xl text-center md:text-left font-bold">¿Tienes una buena idea en mente? ¡Cuentamela!</h2>
          </div>
          <section className="grid grid-rows-2 md:grid-rows-none md:grid-cols-2 gap-4">
            <article className="bg-white border border-[#CCCCCC] rounded-2xl p-7 gap-2.5">
              <div className="flex flex-row gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-messages"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" /><path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" /></svg>
                <p className="font-semibold text-2xl text-black">Hablar con Ventas</p>
              </div>
              <p className="font-normal text-lg text-[#A3A3A3] mb-2">Para contarnos tus ideas.</p>
              <a href="mailto:zodev@proton.me" className="font-semibold text-[#6C48C5] text-lg underline">zodev@proton.me</a>
            </article>
            <article className="bg-white border border-[#CCCCCC] rounded-2xl p-7 gap-2.5">
              <div className="flex flex-row gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-firetruck"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 18h8m4 0h2v-6a5 5 0 0 0 -5 -5h-1l1.5 5h4.5" /><path d="M12 18v-11h3" /><path d="M3 17l0 -5l9 0" /><path d="M3 9l18 -6" /><path d="M6 12l0 -4" /></svg>
                <p className="font-semibold text-2xl text-black">Hablar con Soporte</p>
              </div>
              <p className="font-normal text-lg text-[#A3A3A3] mb-2">Para correciones o ayuda.</p>
              <a href="mailto:zodev@proton.me" className="font-semibold text-[#6C48C5] text-lg underline">zodev@proton.me</a>
            </article>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
