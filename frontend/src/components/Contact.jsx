import { useState } from "react";
import { API } from "../api/axios";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlineBriefcase } from "react-icons/hi2";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      await API.post("/contact", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus({ type: "success", message: "Message sent successfully." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      if (err.response?.status === 401) {
        setStatus({
          type: "error",
          message: "Contact API is protected. Please login first so a token is available.",
        });
      } else {
        setStatus({
          type: "error",
          message: err.response?.data?.error || "Unable to send message right now.",
        });
      }
    } finally {
      setSending(false);
    }
  };

  const onInput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="section-shell">
      <div className="mb-14 text-center fade-up">
        <p className="section-kicker">Get In Touch</p>
        <h2 className="section-heading">Get In Touch</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          Let&apos;s connect and discuss opportunities, collaborations, or a project idea you want to bring to life.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-4 fade-up">
          {[
            { label: "Email", value: "hello.gaurav.dev@gmail.com", icon: HiOutlineEnvelope },
            { label: "Phone", value: "+1 (555) 123-4567", icon: HiOutlinePhone },
            { label: "Location", value: "Indore, India", icon: HiOutlineMapPin },
            { label: "LinkedIn", value: "linkedin.com/in/gauravpatel", icon: HiOutlineBriefcase },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="card flex items-center gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-1 text-base font-medium text-slate-950 sm:text-lg">{item.value}</p>
                </div>
              </article>
            );
          })}
        </div>

        <form onSubmit={submit} className="card fade-up p-6 sm:p-8">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Send a Message</h3>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Name</label>
              <input
                name="name"
                value={form.name}
                placeholder="Your name"
                className="field"
                onChange={onInput}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="your.email@example.com"
                className="field"
                onChange={onInput}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Message</label>
              <textarea
                name="message"
                value={form.message}
                placeholder="Your message..."
                rows={7}
                className="field resize-none"
                onChange={onInput}
                required
              />
            </div>

            <button type="submit" disabled={sending} className="btn-primary w-full">
              {sending ? "Sending..." : "Send Message"}
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
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}