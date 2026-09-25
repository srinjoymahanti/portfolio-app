import { motion } from "framer-motion";
import { Github, ExternalLink, Sparkles } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";

function ProjectCard({ project, featured, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl border p-6 sm:p-7 transition-all bg-white ${
        featured
          ? "border-accent/40 shadow-md md:col-span-2"
          : "border-slate-100 hover:border-accent/30 hover:shadow-md"
      }`}
    >
      {featured && (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
          <Sparkles size={12} /> Featured AI / LLM Project
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
        {project.date && (
          <span className="text-xs text-slate-400 whitespace-nowrap mt-1">{project.date}</span>
        )}
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-4">{project.description}</p>

      {project.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {project.highlights?.length > 0 && (
        <ul className="space-y-1.5 mb-5">
          {project.highlights.map((h, i) => (
            <li key={i} className="text-sm text-slate-500 flex gap-2">
              <span className="text-accent mt-1.5 block w-1 h-1 rounded-full bg-accent shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-accent transition-colors"
          >
            <Github size={16} /> GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-accent transition-colors"
          >
            <ExternalLink size={16} /> Live Demo
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects({ projects }) {
  if (!projects?.length) return null;

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-20 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          subtitle="A mix of AI-powered tools and web applications."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((p, i) => (
            <ProjectCard key={p._id || p.title} project={p} featured index={i} />
          ))}
          {rest.map((p, i) => (
            <ProjectCard key={p._id || p.title} project={p} index={featured.length + i} />
          ))}
        </div>
      </div>
    </section>
  );
}
