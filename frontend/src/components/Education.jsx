import { useEffect, useState } from "react";
import { API } from "../api/axios";

export default function Education() {
  const [educationItems, setEducationItems] = useState([]);
  const [error, setError] = useState("");

  const fallbackItems = [
    {
      title: "Bachelor of Science in Computer Science",
      place: "University of Technology",
      meta: "2022 - 2026",
      detail: "Focused on full-stack development, algorithms, database systems, and modern web architecture.",
      bullets: ["GPA: 3.8/4.0", "Relevant Coursework: Data Structures, ML, Web Development", "Dean's List (2023, 2024)"],
    },
    {
      title: "High School Diploma",
      place: "Central High School",
      meta: "2018 - 2022",
      detail: "Built a strong academic base and first serious interest in software development and technology.",
      bullets: ["Valedictorian", "President of Computer Science Club", "Graduated with honors"],
    },
  ];

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await API.get("/credentials");
        const mapped = res.data.map((item) => ({
          title: item.title,
          place: item.institution || "",
          meta: [item.type, item.year].filter(Boolean).join(" • "),
          detail: item.description || "",
          bullets: [item.score, item.fileUrl].filter(Boolean),
        }));
        setEducationItems(mapped);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load credentials right now.");
      }
    };

    fetchCredentials();
  }, []);

  const displayItems = educationItems.length > 0 ? educationItems : fallbackItems;

  return (
    <section id="education" className="section-shell">
      <div className="mb-14 text-center fade-up">
        <p className="section-kicker">Education &amp; Certifications</p>
        <h2 className="section-heading">Education &amp; Certifications</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          My academic background and achievements, organized as a clean timeline of milestones.
        </p>
      </div>

      {error && educationItems.length === 0 ? (
        <div className="mb-6 card px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {displayItems.map((item) => (
          <article key={item.title} className="card fade-up p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-lg text-slate-700">{item.place}</p>
              </div>
              <p className="text-sm font-medium text-slate-500 sm:text-base">{item.meta}</p>
            </div>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-500 sm:text-base">{item.detail}</p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600 sm:text-base">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

