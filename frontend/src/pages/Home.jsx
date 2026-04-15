import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Education from "../components/Education";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="app-bg relative overflow-x-hidden bg-[#fafaf7] text-slate-900">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[28rem] h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-32 h-80 w-80 rounded-full bg-slate-100/80 blur-3xl" />
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}