import { useState } from "react";
import { API } from "../api/axios";

const initialForm = {
  title: "",
  description: "",
  linkedinLink: "",
  githubLink: "",
  liveLink: "",
  otherLink: "",
  techStack: "",
};

export default function ProjectForm({ onProjectAdded }) {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("linkedinLink", form.linkedinLink);
      payload.append("githubLink", form.githubLink);
      payload.append("liveLink", form.liveLink);
      payload.append("otherLink", form.otherLink);
      payload.append("techStack", form.techStack);

      if (image) {
        payload.append("image", image);
      }

      await API.post("/projects", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ type: "success", message: "Project uploaded successfully." });
      setForm(initialForm);
      setImage(null);
      event.target.reset();
      onProjectAdded?.();
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.error || "Unable to upload project right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-shell">
      <div className="mb-14 text-center fade-up">
        <p className="section-kicker">Admin Upload</p>
        <h2 className="section-heading">Add a Project</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          Use this form to send a new project directly to the backend. The image is uploaded to Cloudinary through the API.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card fade-up mx-auto max-w-5xl p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="field"
              placeholder="Project title"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="field min-h-32 resize-y"
              placeholder="Short project description"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">LinkedIn Link</label>
            <input
              name="linkedinLink"
              value={form.linkedinLink}
              onChange={handleChange}
              className="field"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">GitHub Link</label>
            <input
              name="githubLink"
              value={form.githubLink}
              onChange={handleChange}
              className="field"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Other Link</label>
            <input
              name="otherLink"
              value={form.otherLink}
              onChange={handleChange}
              className="field"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Live Link</label>
            <input
              name="liveLink"
              value={form.liveLink}
              onChange={handleChange}
              className="field"
              placeholder="https://your-project.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Tech Stack
            </label>
            <input
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              className="field"
              placeholder="React, Node.js, MongoDB"
            />
            <p className="mt-2 text-xs text-slate-500">Separate each technology with a comma.</p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Project Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
              className="field py-3"
            />
            <p className="mt-2 text-xs text-slate-500">The backend stores this image in Cloudinary.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={submitting} className="btn-primary min-w-44">
            {submitting ? "Uploading..." : "Upload Project"}
          </button>

          {status.message ? (
            <p
              className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {status.message}
            </p>
          ) : (
            <p className="text-sm text-slate-500">Required fields: title, description, and image.</p>
          )}
        </div>
      </form>
    </section>
  );
}