import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-10 text-center max-w-2xl mx-auto"
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-accent mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-500">{subtitle}</p>}
    </motion.div>
  );
}
