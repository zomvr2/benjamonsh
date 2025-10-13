export default function Header() {
  return (
    <header
      className="py-[30px] lg:px-[60px] flex flex-col lg:flex-row gap-5 items-center justify-between"
    >
      <a href="/">
        <h1 className="font-black text-3xl">
          benjamonsh<span className="font-nanum">.tech</span>
        </h1>
      </a>
      <nav className="bg-white lg:bg-transparent border-t border-b lg:border-0 border-[#CCC] w-full lg:w-fit py-3 flex flex-row items-center justify-center">
        <ul className="flex flex-row gap-8">
          <li><a href="/blog" className="font-medium text-base">Blog</a></li>
          <li><a href="/proyectos" className="font-medium text-base">Proyectos</a></li>
          <li className="hidden lg:block">
            <a
              href="mailto:zodev@proton.me"
              className="font-medium text-base text-white bg-blue-800 px-4 py-2 rounded-lg"
            >¡Quiero un sitio web!</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}