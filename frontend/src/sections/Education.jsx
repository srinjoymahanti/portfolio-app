import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Education({ education }) {
  if (!education?.length) return null;

  return (
    <section id="education" className="py-20 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Education" title="Academic background" />
        <div className="space-y-5">
          {education.map((e, i) => (
            <motion.div
              key={e._id || i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:border-accent/30 hover:shadow-sm transition-all"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {e.degree}
                  {e.field ? ` in ${e.field}` : ""}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">{e.institution}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                  {e.cgpa && <span>CGPA: {e.cgpa}</span>}
                  {(e.startYear || e.endYear) && (
                    <span>{e.startYear || "?"} – {e.endYear || "Present"}</span>
                  )}
                </div>
                {e.description && (
                  <p className="text-sm text-slate-500 mt-2">{e.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
