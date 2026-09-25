/**
 * Seed script
 * -----------------------------------------------------------------------
 * Populates MongoDB with Srinjoy Mahanti's initial portfolio data,
 * exactly as provided in the source resume/profile brief. No facts are
 * invented, embellished, or extrapolated here — this file IS the
 * authoritative source of truth that the chatbot and UI both read from.
 *
 * Run with: npm run seed
 * -----------------------------------------------------------------------
 */
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

import Profile from "../models/Profile.js";
import Education from "../models/Education.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import Experience from "../models/Experience.js";
import Achievement from "../models/Achievement.js";

dotenv.config();

const profileData = {
  name: "Srinjoy Mahanti",
  headline: "IT Engineering Student & Aspiring Full-Stack Web Developer",
  bio: "IT engineering student and aspiring full-stack web developer.",
  // Only fields explicitly provided are filled in. Others are left blank
  // intentionally rather than guessed — update via /api/admin/profile.
  location: "",
  email: "",
  github: "",
  linkedin: "",
  portfolio: "",
  resumeUrl: "",
};

const educationData = [
  {
    institution: "Netaji Subhash Engineering College (NSEC)",
    degree: "B.Tech",
    field: "Information Technology Engineering",
    cgpa: "7.6",
    startYear: "",
    endYear: "",
    description:
      "Information Technology Engineering student under MAKAUT University, currently in the final year of engineering.",
    order: 0,
  },
];

const skillsData = [
  // Programming Languages
  { category: "Programming Languages", name: "JavaScript", order: 0 },
  { category: "Programming Languages", name: "Java", order: 1 },
  { category: "Programming Languages", name: "C", order: 2 },
  { category: "Programming Languages", name: "C++", order: 3 },
  { category: "Programming Languages", name: "Python", order: 4 },
  { category: "Programming Languages", name: "SQL", order: 5 },

  // Frontend
  { category: "Frontend", name: "React.js", order: 0 },
  { category: "Frontend", name: "Next.js", order: 1 },
  { category: "Frontend", name: "HTML", order: 2 },
  { category: "Frontend", name: "CSS", order: 3 },
  { category: "Frontend", name: "Tailwind CSS", order: 4 },
  { category: "Frontend", name: "Framer Motion", order: 5 },
  { category: "Frontend", name: "TypeScript", order: 6 },

  // Backend
  { category: "Backend", name: "Node.js", order: 0 },
  { category: "Backend", name: "Express.js", order: 1 },
  { category: "Backend", name: "MongoDB", order: 2 },
  { category: "Backend", name: "REST APIs", order: 3 },

  // Tools
  { category: "Tools", name: "Git", order: 0 },
  { category: "Tools", name: "GitHub", order: 1 },
  { category: "Tools", name: "Cloudinary", order: 2 },
  { category: "Tools", name: "JWT", order: 3 },
  { category: "Tools", name: "Nodemailer", order: 4 },
  { category: "Tools", name: "MongoDB Atlas", order: 5 },
  { category: "Tools", name: "Vercel", order: 6 },
  { category: "Tools", name: "AWS", order: 7 },

  // Core CS Knowledge
  { category: "Core CS Knowledge", name: "Data Structures and Algorithms", order: 0 },
  { category: "Core CS Knowledge", name: "Object-Oriented Programming", order: 1 },
  { category: "Core CS Knowledge", name: "Operating Systems", order: 2 },
  { category: "Core CS Knowledge", name: "DBMS", order: 3 },
  { category: "Core CS Knowledge", name: "Computer Networks", order: 4 },
  { category: "Core CS Knowledge", name: "Compiler Design", order: 5 },
  { category: "Core CS Knowledge", name: "Cyber Security", order: 6 },
];

const projectsData = [
  {
    title: "Apple Customer Support AI Agent",
    technologies: ["Python", "Groq API", "Pandas", "NumPy", "Streamlit", "GPT-OSS-120B"],
    date: "September 2026",
    description:
      "Built an AI customer-support agent using GPT-OSS-120B and historical AppleSupport interactions to classify customer intent, retrieve relevant support cases, and generate evidence-grounded responses.",
    highlights: [
      "Classified customer intent.",
      "Retrieved relevant historical support cases.",
      "Generated evidence-grounded customer-support responses.",
      "Implemented an automated AUTO HANDLE / ESCALATE decision layer.",
      "Evaluated the system using human-labeled datasets.",
      "Deployed an interactive Streamlit application.",
    ],
    githubUrl: null,
    liveUrl: null,
    image: null,
    featured: true,
    order: 0,
  },
  {
    title: "Text To Image Generator",
    technologies: ["React", "Tailwind CSS", "ClipDrop API"],
    date: "September 2025",
    description:
      "Developed an AI-powered image generation application that enables users to create unique images from descriptive text prompts.",
    highlights: [
      "Created an AI-powered text-to-image application.",
      "Accepted descriptive text prompts from users.",
      "Integrated the ClipDrop API.",
      "Processed user input through the API.",
      "Rendered generated visual content.",
      "Designed the application to support creative workflows.",
    ],
    githubUrl: null,
    liveUrl: null,
    image: null,
    featured: false,
    order: 1,
  },
  {
    title: "Snake Game",
    technologies: ["HTML", "JavaScript", "CSS"],
    date: "October 2025",
    description: "Developed a classic Snake game using vanilla JavaScript, HTML, and CSS.",
    highlights: [
      "Implemented real-time snake movement.",
      "Implemented collision detection.",
      "Implemented dynamic food spawning.",
      "Implemented an adaptive scoring system that increases game speed.",
      "Added keyboard controls.",
      "Added animated elements.",
      "Created a responsive layout.",
      "Used DOM manipulation and event handling.",
      "Implemented CSS animations for an interactive gaming experience.",
    ],
    githubUrl: null,
    liveUrl: null,
    image: null,
    featured: false,
    order: 2,
  },
];

// No verified internship/work experience or achievement/certification data
// was provided in the resume brief. Left empty intentionally — the
// retrieval service and chatbot explicitly say "no records exist" rather
// than inventing anything. Add real records here (or via /api/admin) when
// available.
const experienceData = [];
const achievementsData = [];

async function seed() {
  await connectDB();

  console.log("Clearing existing collections...");
  await Promise.all([
    Profile.deleteMany({}),
    Education.deleteMany({}),
    Skill.deleteMany({}),
    Project.deleteMany({}),
    Experience.deleteMany({}),
    Achievement.deleteMany({}),
  ]);

  console.log("Inserting seed data...");
  await Profile.create(profileData);
  await Education.insertMany(educationData);
  await Skill.insertMany(skillsData);
  await Project.insertMany(projectsData);
  if (experienceData.length) await Experience.insertMany(experienceData);
  if (achievementsData.length) await Achievement.insertMany(achievementsData);

  console.log("Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
