import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Skills from "./sections/Skills.jsx";
import Projects from "./sections/Projects.jsx";
import Education from "./sections/Education.jsx";
import Experience from "./sections/Experience.jsx";
import Achievements from "./sections/Achievements.jsx";
import AIChat from "./sections/AIChat.jsx";
import Contact from "./sections/Contact.jsx";
import {
  getProfile,
  getSkills,
  getProjects,
  getEducation,
  getExperience,
  getAchievements,
} from "./services/api.js";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Single source of truth: all sections + the AI chatbot pull from
    // the same MongoDB-backed REST API, never duplicated hard-coded data.
    getProfile().then(setProfile).catch(() => {});
    getSkills().then(setSkills).catch(() => {});
    getProjects().then(setProjects).catch(() => {});
    getEducation().then(setEducation).catch(() => {});
    getExperience().then(setExperience).catch(() => {});
    getAchievements().then(setAchievements).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Education education={education} />
        <Experience experience={experience} />
        <Achievements achievements={achievements} />
        <AIChat />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
