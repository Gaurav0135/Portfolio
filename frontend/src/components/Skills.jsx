import { useEffect, useState } from "react";
import { API } from "../api/axios";
import {
  SiReact,
  SiJavascript,
  SiPython,
  SiOpenjdk,
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
  SiPython,
  SiOpenjdk,
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

const requiredToolSkills = [
  { name: "Java", icon: SiOpenjdk },
  { name: "Python", icon: SiPython },
];

const mergeRequiredTools = (categories) => {
  const hasToolsCategory = categories.some((category) =>
    category.category.toLowerCase().includes("tools")
  );

  if (!hasToolsCategory) {
    return [
      ...categories,
      {
        category: "Tools & Technologies",
        skills: [
          { name: "Git", icon: SiGit },
          { name: "GitHub", icon: SiGithub },
          ...requiredToolSkills,
          { name: "Vite", icon: SiVite },
          { name: "Postman", icon: SiPostman },
        ],
      },
    ];
  }

  return categories.map((category) => {
    if (!category.category.toLowerCase().includes("tools")) {
      return category;
    }

    const existingSkills = category.skills || [];
    const existingNames = new Set(existingSkills.map((skill) => skill.name));
    const mergedSkills = [...existingSkills];

    requiredToolSkills.forEach((skill) => {
      if (!existingNames.has(skill.name)) {
        mergedSkills.push(skill);
      }
    });

    return {
      ...category,
      skills: mergedSkills,
    };
  });
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
        { name: "Python", icon: SiPython },
        { name: "REST APIs", icon: SiGit },
      ],
    },
    {
      category: "Tools & Technologies",
      skills: [
        { name: "Git", icon: SiGit },
        { name: "GitHub", icon: SiGithub },
        { name: "Java", icon: SiOpenjdk },
        { name: "Python", icon: SiPython },
        { name: "Vite", icon: SiVite },
        { name: "Postman", icon: SiPostman },
      ],
    },
  ];

  const displaySkills = mergeRequiredTools(skills.length > 0 ? skills : defaultSkills);

  return (
    <section id="skills" className="section-shell">
      <div className="mb-14 text-center fade-up">
        <p className="section-kicker">Expertise</p>
        <h2 className="section-heading">Skills & Technologies</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          A practical toolkit of frontend, backend, and developer tools used to build responsive, maintainable applications.
        </p>
      </div>

      {error && !skills.length ? (
        <div className="card px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading && skills.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          Loading skills...
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {displaySkills.map((category) => (
          <article
            key={category.category}
            className="card fade-up p-5 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-[0_24px_70px_rgba(34,211,238,0.12)] sm:p-6"
          >
            <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{category.category}</h3>

            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
              {category.skills.map((skill) => {
                const Icon = getIcon(skill.icon);
                return (
                  <div key={skill.name} className="pill flex items-center gap-2 px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm">
                    {Icon ? <Icon className="text-sm text-cyan-100 sm:text-base" /> : null}
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
