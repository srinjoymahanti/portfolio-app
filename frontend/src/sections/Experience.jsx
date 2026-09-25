import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Experience({ experience }) {
  // Per the anti-hallucination rules, we do not show placeholder or
  // invented experience entries. If there is no verified data, we
  // simply omit the section rather than displaying something misleading.
  if (!experience?.length) return null;

  return (
    <section id="experience" className="py-20 px-5 sm:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Experience" title="Where I've worked" />
        <div className="space-y-5">
          {experience.map((e, i) => (
            <motion.div
              key={e._id || i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-white"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{e.role} · {e.company}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {e.startDate} – {e.endDate || "Present"} {e.location ? `· ${e.location}` : ""}
                </p>
                {e.description && <p className="text-sm text-slate-500 mt-2">{e.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
