import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Hero({ profile }) {
  return (
    <section id="top" className="pt-32 pb-24 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-accent font-semibold mb-4"
        >
          {profile?.headline || "IT Engineering Student • Full-Stack Web Developer"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900"
        >
          Hi, I'm {profile?.name || "Srinjoy Mahanti"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto"
        >
          {profile?.bio ||
            "IT engineering student and aspiring full-stack web developer."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            View Projects
          </a>
          <a
            href="#ai-chat"
            className="px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold text-sm hover:border-accent hover:text-accent transition-colors"
          >
            Ask AI About Me
          </a>
        </motion.div>

        {(profile?.github || profile?.linkedin || profile?.email) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-5 text-slate-400"
          >
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                <Github size={20} />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-accent transition-colors">
                <Mail size={20} />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
