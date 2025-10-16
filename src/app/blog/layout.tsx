import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
