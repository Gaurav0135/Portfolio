import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Education from "../components/Education";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import CursorTrail from "../components/CursorTrail";

export default function Home() {
  return (
    <main className="app-bg relative overflow-x-hidden bg-[#02040b] text-slate-100">
      <CursorTrail />
      <div className="hero-glow -left-24 top-20 h-80 w-80 bg-cyan-400/10 blur-3xl" />
      <div className="hero-glow -right-24 top-[22rem] h-96 w-96 bg-blue-500/10 blur-3xl" />
      <div className="hero-glow left-1/2 top-[44rem] h-[30rem] w-[30rem] -translate-x-1/2 bg-cyan-300/5 blur-3xl" />
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