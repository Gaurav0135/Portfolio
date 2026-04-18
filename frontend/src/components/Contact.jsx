import { useState } from "react";
import { API } from "../api/axios";
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlineBriefcase } from "react-icons/hi2";
import { FaWhatsapp, FaGithub, FaLinkedinIn } from "react-icons/fa6";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      await API.post("/contact", form);

      setStatus({ type: "success", message: "Message sent successfully." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Unable to send message right now.",
      });
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
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          Let&apos;s connect and discuss opportunities, collaborations, or a project idea you want to bring to life.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-4 fade-up">
          {[
            { label: "Email", value: "gauravpatel260931@gmail.com", icon: HiOutlineEnvelope, href: "mailto:gauravpatel260931@gmail.com" },
            { label: "WhatsApp", value: "+91 9691184503", icon: FaWhatsapp, href: "https://wa.me/919691184503" },
            { label: "GitHub", value: "github.com/Gaurav0135", icon: FaGithub, href: "https://github.com/Gaurav0135" },
            { label: "LinkedIn", value: "linkedin.com/in/gaurav-patel-9a34212bb", icon: FaLinkedinIn, href: "https://www.linkedin.com/in/gaurav-patel-9a34212bb/" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href?.startsWith("http") ? "_blank" : undefined}
                rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
                className="card flex items-center gap-4 p-4 sm:p-5 sm:p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100 sm:h-12 sm:w-12">
                  <Icon className="text-lg sm:text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-1 text-base font-medium text-white sm:text-lg">{item.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        <form onSubmit={submit} className="card fade-up p-6 sm:p-8">
          <h3 className="text-2xl font-semibold tracking-tight text-white">Send a Message</h3>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Name</label>
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
              <label className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
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
              <label className="mb-2 block text-sm font-semibold text-slate-200">Message</label>
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
                    ? "bg-emerald-500/10 text-emerald-200"
                    : "bg-rose-500/10 text-rose-200"
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