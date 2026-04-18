import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { FaArrowUpRightFromSquare, FaGithub, FaLinkedinIn } from "react-icons/fa6";

const formatDescription = (description = "") =>
  description
    .split(/[\n•]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function Projects({ refreshKey = 0 }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Unable to load projects right now.");
      }
    };

    getProjects();
  }, [refreshKey]);

  return (
    <section id="projects" className="section-shell">
      <div className="mb-14 text-center fade-up">
        <p className="section-kicker">Featured Projects</p>
        <h2 className="section-heading">Featured Projects</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          Some of my recent work and side projects, presented with a clean layout and clear focus on impact.
        </p>
      </div>

      {error ? (
        <div className="card px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {!error && projects.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          Projects will appear here once added from the backend dashboard.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:auto-rows-fr">
        {projects.map((p) => (
          <article
            key={p._id}
            className="card group fade-up flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-[0_24px_70px_rgba(34,211,238,0.12)]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07111f] sm:aspect-[16/9]">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),rgba(2,6,23,0.95)_72%)]">
                  <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{p.title}</h3>

              {formatDescription(p.description).length > 1 ? (
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300 sm:text-base">
                  {formatDescription(p.description).map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base">
                  {p.description}
                </p>
              )}

              {p.techStack?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="pill text-xs font-medium text-cyan-50">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 text-sm font-semibold text-cyan-100 sm:gap-5">
                {p.linkedinLink ? (
                  <a
                    href={p.linkedinLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <FaLinkedinIn /> LinkedIn
                  </a>
                ) : null}

                {p.githubLink ? (
                  <a
                    href={p.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <FaGithub /> GitHub
                  </a>
                ) : null}

                {p.liveLink ? (
                  <a
                    href={p.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <FaArrowUpRightFromSquare /> Live
                  </a>
                ) : null}

                {p.otherLink || p.githubLink2 ? (
                  <a
                    href={p.otherLink || p.githubLink2}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <FaLinkedinIn /> LinkedIn
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}