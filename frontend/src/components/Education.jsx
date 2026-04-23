import { useEffect, useState } from "react";
import { API } from "../api/axios";
import certificatePlaceholder from "../assets/certificate-placeholder.svg";

export default function Education() {
  const [educationItems, setEducationItems] = useState([]);
  const [error, setError] = useState("");

  const fallbackEducationItems = [
    {
      id: "fallback-ug",
      type: "education",
      title: "Bachelor of Science in Computer Science",
      place: "University of Technology",
      meta: "2022 - 2026",
      detail: "Focused on full-stack development, algorithms, database systems, and modern web architecture.",
      bullets: ["GPA: 3.8/4.0", "Relevant Coursework: Data Structures, ML, Web Development", "Dean's List (2023, 2024)"],
    },
    {
      id: "fallback-hs",
      type: "education",
      title: "High School Diploma",
      place: "Central High School",
      meta: "2018 - 2022",
      detail: "Built a strong academic base and first serious interest in software development and technology.",
      bullets: ["Valedictorian", "President of Computer Science Club", "Graduated with honors"],
    },
  ];

  const staticCertificationItems = [
    {
      id: "cert-java",
      type: "certificate",
      title: "Java Certificate",
      place: "Certification",
      meta: "Certificate",
      detail: "Java programming certification hosted directly on the portfolio frontend.",
      bullets: [],
      credential: "",
      liveUrl: "",
      fileUrl: "/certificates/java-certificate.pdf",
    },
    {
      id: "cert-nvidia",
      type: "certificate",
      title: "NVIDIA Certificate",
      place: "Certification",
      meta: "Certificate",
      detail: "NVIDIA certification hosted directly on the portfolio frontend.",
      bullets: [],
      credential: "",
      liveUrl: "",
      fileUrl: "/certificates/nvidia-certificate.pdf",
    },
    {
      id: "cert-screenshot-1",
      type: "certificate",
      title: "Certificate Screenshot 1",
      place: "Certification",
      meta: "Certificate Preview",
      detail: "Additional certificate preview hosted directly on the portfolio frontend.",
      bullets: [],
      credential: "",
      liveUrl: "",
      fileUrl: "/certificates/Screenshot 2026-04-18 123608-1776496232828-803330293.png",
    },
    {
      id: "cert-screenshot-2",
      type: "certificate",
      title: "Certificate Screenshot 2",
      place: "Certification",
      meta: "Certificate Preview",
      detail: "Additional certificate preview hosted directly on the portfolio frontend.",
      bullets: [],
      credential: "",
      liveUrl: "",
      fileUrl: "/certificates/Screenshot 2026-04-18 123625-1776496065485-454282282.png",
    },
  ];

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await API.get("/credentials");
        const mappedEducation = res.data
          .filter((item) => (item.type || "").toLowerCase() === "education")
          .map((item) => ({
          id: item._id || `${item.title}-${item.year || ""}`,
          type: "education",
          title: item.title,
          place: item.institution || "",
          meta: [item.type, item.year].filter(Boolean).join(" • "),
          detail: item.description || "",
          bullets: [item.score].filter(Boolean),
          credential: item.credential || "",
          liveUrl: item.liveUrl || "",
          fileUrl: item.fileUrl || "",
        }));
        setEducationItems(mappedEducation);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load credentials right now.");
      }
    };

    fetchCredentials();
  }, []);

  const sourceEducationItems = educationItems.length > 0 ? educationItems : fallbackEducationItems;
  const educationList = sourceEducationItems;
  const certificationList = staticCertificationItems;

  const renderCard = (item, showCertificatePreview) => (
    <article
      key={item.id || item.title}
      className="card group fade-up flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-[0_24px_70px_rgba(34,211,238,0.12)]"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{item.title}</h3>
          <p className="text-sm font-medium text-slate-400">{item.meta}</p>
        </div>

        <p className="mt-3 text-lg text-slate-300">{item.place}</p>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{item.detail}</p>

        {(item.bullets || []).length ? (
          <ul className="mt-5 space-y-3 text-sm text-slate-300 sm:text-base">
            {(item.bullets || []).map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {item.credential ? (
          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Certificate ID: <span className="font-medium text-cyan-100">{item.credential}</span>
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          {item.fileUrl ? (
            <a
              href={item.fileUrl || certificatePlaceholder}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-50 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white"
            >
              View
            </a>
          ) : null}

          {item.liveUrl ? (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-50 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white"
            >
              Live URL
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );

  return (
    <section id="education" className="section-shell">
      <div className="mb-12 text-center fade-up sm:mb-14">
        <p className="section-kicker">Education &amp; Certifications</p>
        <h2 className="section-heading">Education &amp; Certifications</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          My academic background and achievements, organized as a clean timeline of milestones.
        </p>
      </div>

      {error && items.length === 0 ? (
        <div className="mb-6 card px-4 py-3 text-sm text-rose-300">{error}</div>
      ) : null}

      <div className="mb-8 text-center fade-up">
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">Experience &amp; Education</h3>
      </div>

      {educationList.length ? (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:auto-rows-fr">
          {educationList.map((item) => renderCard(item, false))}
        </div>
      ) : (
        <div className="mx-auto mb-8 max-w-6xl card p-6 text-center text-slate-400">No education entries yet.</div>
      )}

      <div className="mb-8 mt-14 text-center fade-up sm:mt-16">
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">Certifications</h3>
      </div>

      {certificationList.length ? (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:auto-rows-fr">
          {certificationList.map((item) => renderCard(item, true))}
        </div>
      ) : (
        <div className="mx-auto max-w-6xl card p-6 text-center text-slate-400">No certifications added yet.</div>
      )}
    </section>
  );
}

