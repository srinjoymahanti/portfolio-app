import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Skills({ skills }) {
  if (!skills?.length) return null;

  const grouped = skills.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 px-5 sm:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          subtitle="Languages, frameworks, and tools from my coursework and projects."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, items], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:border-accent/30 transition-all"
            >
              <h3 className="font-semibold text-slate-900 mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <span
                    key={s._id || s.name}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent/10 text-accent-dark"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
