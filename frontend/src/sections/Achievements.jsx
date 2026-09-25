import { motion } from "framer-motion";
import { Award } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Achievements({ achievements }) {
  if (!achievements?.length) return null;

  return (
    <section id="achievements" className="py-20 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Achievements" title="Recognition & certifications" />
        <div className="grid sm:grid-cols-2 gap-4">
          {achievements.map((a, i) => (
            <motion.div
              key={a._id || i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-3 p-5 rounded-2xl border border-slate-100 hover:border-accent/30 transition-all"
            >
              <div className="shrink-0 w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <Award size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">{a.title}</h4>
                {a.date && <p className="text-xs text-slate-400 mt-0.5">{a.date}</p>}
                {a.description && <p className="text-sm text-slate-500 mt-1">{a.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
