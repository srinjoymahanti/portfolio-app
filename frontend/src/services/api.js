import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

export const getProfile = () => api.get("/profile").then((r) => r.data);
export const getSkills = () => api.get("/skills").then((r) => r.data);
export const getProjects = () => api.get("/projects").then((r) => r.data);
export const getExperience = () => api.get("/experience").then((r) => r.data);
export const getEducation = () => api.get("/education").then((r) => r.data);
export const getAchievements = () => api.get("/achievements").then((r) => r.data);

export const sendChatMessage = (message) =>
  api.post("/chat", { message }).then((r) => r.data);

export const sendContactMessage = (payload) =>
  api.post("/contact", payload).then((r) => r.data);

export default api;
