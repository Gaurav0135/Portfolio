import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";

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
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          Some of my recent work and side projects, presented with a clean layout and clear focus on impact.
        </p>
      </div>

      {error ? (
        <div className="card px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!error && projects.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          Projects will appear here once added from the backend dashboard.
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p._id}
            className="card group fade-up flex flex-col overflow-hidden self-start transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200">
                  <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-slate-900 to-slate-400" />
                </div>
              )}
            </div>

            <div className="flex flex-col p-6">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{p.title}</h3>

              {formatDescription(p.description).length > 1 ? (
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
                  {formatDescription(p.description).map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                  {p.description}
                </p>
              )}

              {p.techStack?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="pill text-xs font-medium text-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 flex items-center gap-5 text-sm font-semibold text-slate-700">
                {p.githubLink ? (
                  <a
                    href={p.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-slate-950"
                  >
                    <FaGithub /> LinkedIn
                  </a>
                ) : null}

                {p.githubLink2 ? (
                  <a
                    href={p.githubLink2}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-slate-950"
                  >
                    <FaGithub /> Explanation
                  </a>
                ) : null}

                {p.liveLink ? (
                  <a
                    href={p.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-slate-950"
                  >
                    <FaArrowUpRightFromSquare /> Live
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