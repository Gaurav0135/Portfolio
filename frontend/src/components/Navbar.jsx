import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
  const links = [
    { href: "#home", label: "Home" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <a href="#home" className="flex items-center gap-3 text-sm font-semibold text-slate-900" aria-label="Home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white shadow-sm">
            GP
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {link.label}
            </a>
          ))}
          <a
            href={adminUrl}
            className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
          >
            Admin
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {link.label}
              </a>
            ))}
            <a
              href={adminUrl}
              onClick={() => setOpen(false)}
              className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Admin Panel
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}