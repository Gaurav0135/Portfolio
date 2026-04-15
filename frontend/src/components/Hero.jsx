import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import heroImage from "../assets/profile.svg";

export default function Hero() {
  return (
    <section id="home" className="section-shell flex min-h-[calc(100vh-88px)] items-center justify-center">
      <div className="fade-up grid w-full max-w-4xl place-items-center text-center">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute h-44 w-44 rounded-full bg-slate-900/10 blur-3xl sm:h-56 sm:w-56" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-slate-700 to-slate-300 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:h-40 sm:w-40">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/85">
              <img src={heroImage} alt="Gaurav Patel" className="h-[88%] w-[88%] object-contain" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Hi, I&apos;m Gaurav Patel
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-slate-500 sm:text-2xl">
          Computer Science Student &amp; Software Developer
        </h2>

        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
          Passionate about building practical products, clean interfaces, and reliable full-stack systems.
          I focus on modern web development, thoughtful UX, and code that is easy to maintain.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="btn-primary min-w-44">
            View My Work
          </a>

          <a href="#contact" className="btn-soft min-w-44">
            Get In Touch
          </a>
        </div>

        <div className="mt-10 flex items-center gap-3 text-slate-500">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
            <FaGithub size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
            <FaLinkedin size={18} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
            <FaInstagram size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}