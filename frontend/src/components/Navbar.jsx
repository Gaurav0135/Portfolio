import { useState } from "react";
import { getFallbackResumeUrl } from "../utils/resumeUrl";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const resumeUrl = getFallbackResumeUrl();
  const links = [
    { href: "#home", label: "Home" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ];

  const logoProps = {
    href: resumeUrl,
    target: "_blank",
    rel: "noreferrer",
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[#02040bcc] backdrop-blur-2xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4 lg:px-10">
        <a
          {...logoProps}
          className="flex items-center gap-3 text-sm font-semibold text-white"
          aria-label="Resume"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.15)] sm:h-10 sm:w-10 sm:text-sm">
            GP
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-cyan-400/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-full border border-cyan-400/20 bg-white/5 px-3 py-2 text-xs font-medium text-cyan-50 shadow-sm sm:text-sm md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-cyan-400/10 bg-[#02040b]/95 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}