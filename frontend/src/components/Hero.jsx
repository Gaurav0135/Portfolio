// import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

// export default function Hero() {
//   return (
//     <section id="home" className="section-shell flex min-h-[calc(100vh-88px)] items-center justify-center overflow-hidden">
//       <div className="relative w-full max-w-4xl">
//         <div className="fade-up relative rounded-[2rem] border border-cyan-400/10 bg-white/5 px-6 py-10 text-center shadow-[0_0_80px_rgba(34,211,238,0.08)] backdrop-blur-2xl sm:px-10 lg:px-12">
//           <div className="hero-glow -left-20 top-0 h-40 w-40 bg-cyan-400/20 blur-3xl" />
//           <div className="hero-glow right-0 top-24 h-52 w-52 bg-blue-500/20 blur-3xl" />

//           <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">About Me</p>

//           <h1 className="hero-name mt-5 text-4xl font-black uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl">
//             <span className="block text-2xl font-bold uppercase tracking-[0.2em] text-white/90 sm:text-3xl">
//               Hi, I am
//             </span>
//             <span className="block text-neon">Gaurav</span>
//             <span className="block text-cyan-300">Patel</span>
//           </h1>

//           <div className="mx-auto mt-6 max-w-2xl">
//             <div className="neon-line mb-6" />
//             <p className="text-base leading-8 text-slate-300 sm:text-lg">
//               Final Year CSE Student | Frontend Developer
//             </p>
//             <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
//               I build responsive web applications using React and modern technologies, with experience in Python for
//               problem-solving and backend logic.
//             </p>
//           </div>

//           <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
//             <a href="#projects" className="btn-primary min-w-44">
//               View My Work
//             </a>

//             <a href="#contact" className="btn-soft min-w-44">
//               Get In Touch
//             </a>
//           </div>

//           <div className="mt-8 flex items-center justify-center gap-3 text-slate-400">
//             <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
//               <FaGithub size={18} />
//             </a>
//             <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
//               <FaLinkedin size={18} />
//             </a>
//             <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
//               <FaInstagram size={18} />
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import { getFallbackResumeUrl } from "../utils/resumeUrl";

export default function Hero() {
  const resumeUrl = getFallbackResumeUrl();

  return (
    <section
      id="home"
      className="section-shell flex min-h-[calc(100vh-88px)] items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85 }}
        className="relative w-full max-w-6xl px-1 text-center sm:px-0"
      >
        {/* <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="floating-badge absolute left-2 top-2 hidden md:block"
        >
          About Me
        </motion.div> */}

        {/* <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="floating-badge absolute right-2 top-40 hidden md:block"
        >
          Tech
        </motion.div> */}

        <div className="hero-glow left-1/2 top-10 h-72 w-72 -translate-x-1/2 bg-cyan-400/15 blur-3xl" />
        <div className="hero-glow left-1/2 top-48 h-96 w-[36rem] -translate-x-1/2 bg-blue-500/10 blur-3xl" />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold italic tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          Hi, I am
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="hero-name mt-4 bg-gradient-to-r from-cyan-300 to-sky-500 bg-clip-text text-4xl font-black uppercase leading-none text-transparent drop-shadow-[0_0_24px_rgba(14,165,233,0.4)] sm:text-6xl lg:text-8xl"
        >
          Gaurav Patel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-7 text-xl font-semibold italic tracking-tight text-white sm:text-3xl lg:text-5xl"
        >
          MERN Stack Developer | Python Enthusiast
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg"
        >
          I build responsive web applications using React and modern technologies, with experience in Python for
          problem-solving and backend logic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-6 sm:mt-14"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 text-sm shadow-[0_0_24px_rgba(34,211,238,0.16)] sm:w-auto sm:px-6 sm:py-4 sm:text-base"
              aria-label="Resume"
            >
              <FaDownload size={18} />
              Resume
            </motion.a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.a
            whileHover={{ scale: 1.08, y: -2 }}
            href="https://github.com/Gaurav0135"
            target="_blank"
            rel="noreferrer"
            className="social-icon h-14 w-14 rounded-2xl sm:h-16 sm:w-16"
            aria-label="GitHub"
          >
            <FaGithub size={24} className="sm:text-[28px]" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.08, y: -2 }}
            href="https://www.linkedin.com/in/gaurav-patel-9a34212bb/"
            target="_blank"
            rel="noreferrer"
            className="social-icon h-14 w-14 rounded-2xl sm:h-16 sm:w-16"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} className="sm:text-[28px]" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.08, y: -2 }}
            href="mailto:gauravpatel260931@gmail.com"
            className="social-icon h-14 w-14 rounded-2xl sm:h-16 sm:w-16"
            aria-label="Email"
          >
            <FaEnvelope size={22} className="sm:text-[26px]" />
          </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}