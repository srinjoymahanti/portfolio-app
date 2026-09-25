/**
 * Retrieval Service
 * -----------------------------------------------------------------------
 * This is the grounding layer that sits between the user's question and
 * the LLM. It is intentionally simple (keyword/category based) for v1,
 * but is structured so it can later be swapped for embeddings/vector
 * search/RAG without changing the controller or the Groq service.
 *
 * The golden rule: the LLM NEVER sees the raw question without also
 * receiving a tightly-scoped, factual context built directly from
 * MongoDB. If nothing relevant is found, we say so explicitly in the
 * context so the LLM is instructed to admit the gap rather than invent
 * an answer.
 * -----------------------------------------------------------------------
 */

import Profile from "../models/Profile.js";
import Education from "../models/Education.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import Experience from "../models/Experience.js";
import Achievement from "../models/Achievement.js";

// Category keyword map. Add more synonyms over time as needed.
const CATEGORY_KEYWORDS = {
  profile: [
    "who is", "about", "srinjoy", "himself", "background", "profession",
    "profile", "developer", "engineer", "introduce", "summary",
  ],
  education: [
    "study", "studied", "education", "college", "university", "degree",
    "cgpa", "gpa", "makaut", "nsec", "netaji", "academic", "semester", "year",
  ],
  skills: [
    "technology", "technologies", "tech stack", "skill", "skills",
    "language", "languages", "frontend", "front-end", "backend", "back-end",
    "tools", "know", "proficient", "react", "node", "javascript", "python",
    "java", "c++", "sql", "database", "framework", "library",
  ],
  projects: [
    "project", "projects", "built", "build", "apple", "snake game",
    "text to image", "clipdrop", "github repo", "app", "application",
    "portfolio project", "rag", "chatbot project", "llm",
  ],
  experience: [
    "internship", "intern", "experience", "work", "worked", "job",
    "company", "employer", "role", "position",
  ],
  achievements: [
    "achievement", "achievements", "award", "certification", "certificate",
    "hackathon", "competition", "recognition",
  ],
  contact: [
    "contact", "email", "reach", "linkedin", "github profile", "hire",
    "connect", "resume", "cv",
  ],
};

function detectCategories(question) {
  const q = question.toLowerCase();
  const matched = new Set();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw)) {
        matched.add(category);
        break;
      }
    }
  }

  // Fallback: if nothing matched, retrieve a broad but bounded default
  // (profile + skills + projects) so the LLM has *something* grounded
  // to reason over, rather than nothing at all.
  if (matched.size === 0) {
    matched.add("profile");
    matched.add("skills");
    matched.add("projects");
  }

  return Array.from(matched);
}

async function buildContextBlocks(categories) {
  const blocks = [];

  if (categories.includes("profile") || categories.includes("contact")) {
    const profile = await Profile.findOne().lean();
    if (profile) {
      blocks.push(
        `PROFILE:\nName: ${profile.name}\nHeadline: ${profile.headline}\nBio: ${profile.bio}\n` +
          (profile.location ? `Location: ${profile.location}\n` : "") +
          (profile.email ? `Email: ${profile.email}\n` : "") +
          (profile.github ? `GitHub: ${profile.github}\n` : "") +
          (profile.linkedin ? `LinkedIn: ${profile.linkedin}\n` : "") +
          (profile.resumeUrl ? `Resume: ${profile.resumeUrl}\n` : "")
      );
    }
  }

  if (categories.includes("education")) {
    const education = await Education.find().sort({ order: 1 }).lean();
    if (education.length) {
      const text = education
        .map(
          (e) =>
            `- ${e.degree}${e.field ? " in " + e.field : ""} at ${e.institution}` +
            (e.cgpa ? `, CGPA: ${e.cgpa}` : "") +
            (e.startYear || e.endYear
              ? `, ${e.startYear || "?"} - ${e.endYear || "present"}`
              : "") +
            (e.description ? `. ${e.description}` : "")
        )
        .join("\n");
      blocks.push(`EDUCATION:\n${text}`);
    }
  }

  if (categories.includes("skills")) {
    const skills = await Skill.find().sort({ category: 1, order: 1 }).lean();
    if (skills.length) {
      const byCategory = {};
      for (const s of skills) {
        if (!byCategory[s.category]) byCategory[s.category] = [];
        byCategory[s.category].push(s.name);
      }
      const text = Object.entries(byCategory)
        .map(([cat, names]) => `- ${cat}: ${names.join(", ")}`)
        .join("\n");
      blocks.push(`SKILLS:\n${text}`);
    }
  }

  if (categories.includes("projects")) {
    const projects = await Project.find().sort({ order: 1 }).lean();
    if (projects.length) {
      const text = projects
        .map((p) => {
          const lines = [
            `- Title: ${p.title}`,
            `  Date: ${p.date || "N/A"}`,
            `  Technologies: ${(p.technologies || []).join(", ")}`,
            `  Description: ${p.description}`,
          ];
          if (p.highlights && p.highlights.length) {
            lines.push(`  Highlights: ${p.highlights.join("; ")}`);
          }
          if (p.githubUrl) lines.push(`  GitHub: ${p.githubUrl}`);
          if (p.liveUrl) lines.push(`  Live Demo: ${p.liveUrl}`);
          return lines.join("\n");
        })
        .join("\n\n");
      blocks.push(`PROJECTS:\n${text}`);
    }
  }

  if (categories.includes("experience")) {
    const experience = await Experience.find().sort({ order: 1 }).lean();
    if (experience.length) {
      const text = experience
        .map((e) => {
          const lines = [
            `- Role: ${e.role} at ${e.company}`,
            `  Duration: ${e.startDate || "N/A"} - ${e.endDate || "present"}`,
          ];
          if (e.location) lines.push(`  Location: ${e.location}`);
          if (e.technologies?.length)
            lines.push(`  Technologies: ${e.technologies.join(", ")}`);
          if (e.description) lines.push(`  Description: ${e.description}`);
          if (e.achievements?.length)
            lines.push(`  Achievements: ${e.achievements.join("; ")}`);
          return lines.join("\n");
        })
        .join("\n\n");
      blocks.push(`EXPERIENCE:\n${text}`);
    } else {
      // Explicitly tell the LLM there is no experience data, so it does
      // not need to guess or hedge ambiguously.
      blocks.push(
        `EXPERIENCE:\nNo internship or work experience records exist in the portfolio database.`
      );
    }
  }

  if (categories.includes("achievements")) {
    const achievements = await Achievement.find().sort({ order: 1 }).lean();
    if (achievements.length) {
      const text = achievements
        .map(
          (a) =>
            `- ${a.title}${a.date ? " (" + a.date + ")" : ""}${
              a.description ? ": " + a.description : ""
            }`
        )
        .join("\n");
      blocks.push(`ACHIEVEMENTS:\n${text}`);
    } else {
      blocks.push(
        `ACHIEVEMENTS:\nNo achievement or certification records exist in the portfolio database.`
      );
    }
  }

  return blocks;
}

/**
 * Main entry point used by the chat controller.
 * Returns { context, categories } where `context` is a plain-text block
 * ready to be embedded in the Groq system prompt.
 */
export async function retrieveContext(question) {
  const categories = detectCategories(question);
  const blocks = await buildContextBlocks(categories);

  const context =
    blocks.length > 0
      ? blocks.join("\n\n")
      : "No relevant information was found in the portfolio database for this question.";

  return { context, categories };
}

export default { retrieveContext };
