import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, Send, CheckCircle2, AlertCircle } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import { sendContactMessage } from "../services/api.js";

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContactMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const links = [
    profile?.email && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile?.github && { icon: Github, label: "GitHub", href: profile.github },
    profile?.linkedin && { icon: Linkedin, label: "LinkedIn", href: profile.linkedin },
    profile?.resumeUrl && { icon: FileText, label: "Resume", href: profile.resumeUrl },
  ].filter(Boolean);

  return (
    <section id="contact" className="py-20 px-5 sm:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Contact" title="Let's connect" subtitle="Open to internship and entry-level software development opportunities." />

        {links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-accent hover:text-accent transition-colors"
              >
                <l.icon size={16} /> {l.label}
              </a>
            ))}
          </div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Your email"
              className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Your message"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors disabled:opacity-60"
          >
            <Send size={16} />
            {status === "sending" ? "Sending..." : "Send message"}
          </button>

          {status === "success" && (
            <p className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 size={16} /> Message sent. Thanks for reaching out!
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle size={16} /> Something went wrong. Please try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
