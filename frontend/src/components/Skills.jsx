import { useEffect, useState } from "react";
import { API } from "../api/axios";
import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
  SiVite,
  SiPostman,
} from "react-icons/si";

const iconMap = {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
  SiVite,
  SiPostman,
};

const getIcon = (icon) => {
  if (typeof icon === "function") return icon;
  if (typeof icon === "string") return iconMap[icon];
  return null;
};

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await API.get("/skills");
        setSkills(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load skills right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Default skills if backend is empty
  const defaultSkills = [
    {
      category: "Frontend",
      skills: [
        { name: "React.js", icon: SiReact },
        { name: "JavaScript", icon: SiJavascript },
        { name: "Tailwind CSS", icon: SiTailwindcss },
        { name: "HTML5", icon: SiHtml5 },
      ],
    },
    {
      category: "Backend",
      skills: [
        { name: "Node.js", icon: SiNodedotjs },
        { name: "Express.js", icon: SiExpress },
        { name: "MongoDB", icon: SiMongodb },
        { name: "REST APIs", icon: SiGit },
      ],
    },
    {
      category: "Tools & Technologies",
      skills: [
        { name: "Git", icon: SiGit },
        { name: "GitHub", icon: SiGithub },
        { name: "Vite", icon: SiVite },
        { name: "Postman", icon: SiPostman },
      ],
    },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <section id="skills" className="section-shell">
      <div className="mb-14 text-center fade-up">
        <p className="section-kicker">Expertise</p>
        <h2 className="section-heading">Skills & Technologies</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          A practical toolkit of frontend, backend, and developer tools used to build responsive, maintainable applications.
        </p>
      </div>

      {error && !skills.length ? (
        <div className="card px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading && skills.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          Loading skills...
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {displaySkills.map((category) => (
          <article key={category.category} className="card fade-up p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">{category.category}</h3>

            <div className="mt-6 flex flex-wrap gap-3">
              {category.skills.map((skill) => {
                const Icon = getIcon(skill.icon);
                return (
                  <div key={skill.name} className="pill flex items-center gap-2">
                    {Icon ? <Icon className="text-base text-slate-700" /> : null}
                    <span>{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
