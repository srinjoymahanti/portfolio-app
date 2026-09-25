# Srinjoy Mahanti — AI-Powered Portfolio (MERN Stack)

A production-ready personal portfolio web application built with **MongoDB, Express.js, React.js, and Node.js**, featuring an AI-powered "Ask About Me" chat section that answers visitor questions **strictly from verified resume/profile data** — with a built-in anti-hallucination system so the AI never invents facts.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Environment Setup](#environment-setup)
7. [MongoDB Setup](#mongodb-setup)
8. [Groq Setup](#groq-setup)
9. [Development](#development)
10. [Production Build](#production-build)
11. [Deployment](#deployment)
12. [API Endpoints](#api-endpoints)
13. [Chatbot Grounding Architecture](#chatbot-grounding-architecture)
14. [Security Considerations](#security-considerations)

---

## Overview

This portfolio is designed for a software engineering student applying to internships and entry-level roles. Its centerpiece is an AI chat widget that lets visitors ask natural-language questions ("What projects has he built?", "Where did he intern?") and get answers that are **traceable to MongoDB records**, never to the LLM's general knowledge about the world.

## Features

- Modern, minimal, responsive UI built with Tailwind CSS and Framer Motion
- Sections: Hero, About, Skills, Projects, Education, Experience, Achievements, Ask About Me (AI chat), Contact
- AI chat grounded in a MongoDB-backed knowledge base via Groq LLM
- Single source of truth: the same MongoDB collections power the UI *and* the chatbot
- Contact form with optional Nodemailer email delivery
- Rate limiting, Helmet, CORS, input validation/sanitization
- Seed script with the real resume data already filled in
- Minimal protected admin endpoints for future data updates

## Tech Stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, Axios, lucide-react
**Backend:** Node.js, Express.js, Mongoose, Groq SDK, Nodemailer, express-rate-limit, express-validator, Helmet
**Database:** MongoDB (Atlas recommended)
**AI:** Groq API (Llama 3.1 models by default)

## Architecture

```
React (Vite) ──HTTP──▶ Express API ──▶ MongoDB (profile / skills / projects / ...)
                              │
                              ▼
                    Retrieval Service (keyword/category grounding)
                              │
                              ▼
                         Groq LLM (grounded system prompt)
                              │
                              ▼
                      Grounded, source-backed answer
```

The frontend never talks to Groq directly — the API key stays server-side, and the LLM only ever sees the retrieved MongoDB context plus the visitor's question.

## Folder Structure

```
portfolio-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers (profile, skills, projects, chat, contact, admin...)
│   │   ├── routes/          # Express routers
│   │   ├── models/          # Mongoose schemas
│   │   ├── services/        # groqService.js, retrievalService.js
│   │   ├── middleware/      # errorHandler, rateLimiter, validate, adminAuth
│   │   ├── config/          # db.js
│   │   ├── seed/            # seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, SectionHeading
│   │   ├── sections/        # Hero, About, Skills, Projects, Education, Experience, Achievements, AIChat, Contact
│   │   ├── services/        # api.js (Axios client)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── .env.example
│   └── package.json
└── README.md
```

## Environment Setup

Clone/download the project, then in **both** `backend/` and `frontend/`:

```bash
cp .env.example .env
```

Fill in the backend `.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
PORT=5000
CLIENT_URL=http://localhost:5173
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=
NODE_ENV=development
ADMIN_SECRET=choose-a-strong-secret   # optional, enables /api/admin/*
```

Fill in the frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow network access (or `0.0.0.0/0` for development).
3. Copy the connection string into `MONGODB_URI` in `backend/.env`.
4. (Local alternative) Install MongoDB Community Server and use `mongodb://localhost:27017/portfolio`.

## Groq Setup

1. Create an account at [console.groq.com](https://console.groq.com).
2. Generate an API key.
3. Paste it into `GROQ_API_KEY` in `backend/.env`.
4. Optionally change `GROQ_MODEL` to any current Groq-hosted model you have access to.

## Development

**Backend:**

```bash
cd backend
npm install
npm run seed   # populates MongoDB with Srinjoy's verified profile data
npm run dev    # starts Express on http://localhost:5000
```

**Frontend (in a separate terminal):**

```bash
cd frontend
npm install
npm run dev    # starts Vite on http://localhost:5173
```

Visit `http://localhost:5173`.

## Production Build

```bash
# Frontend
cd frontend
npm run build     # outputs static files to frontend/dist

# Backend
cd backend
npm start          # runs the compiled server (no build step needed for Node/Express)
```

## Deployment

- **Frontend → Vercel:** import the `frontend/` folder as the project root, set `VITE_API_URL` to your deployed backend URL, build command `npm run build`, output directory `dist`.
- **Backend → Render / Railway:** import the `backend/` folder, set the environment variables from `.env.example`, start command `npm start`.
- **Database → MongoDB Atlas:** use the same connection string in your hosted backend's environment variables.
- Update `CLIENT_URL` in the backend's environment to your deployed frontend URL so CORS allows it.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | Get profile info |
| GET | `/api/skills` | Get all skills |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get a single project |
| GET | `/api/education` | Get education records |
| GET | `/api/experience` | Get experience records |
| GET | `/api/achievements` | Get achievements |
| POST | `/api/chat` | Ask the AI assistant (`{ "message": "..." }`) |
| POST | `/api/contact` | Submit the contact form |
| POST/PUT | `/api/admin/profile` | Update profile (requires `x-admin-secret` header) |
| POST | `/api/admin/projects` | Create a project (requires `x-admin-secret` header) |
| PUT | `/api/admin/projects/:id` | Update a project (requires `x-admin-secret` header) |

## Chatbot Grounding Architecture

```
User Question
   ↓
Keyword/Category Detection (retrievalService.js)
   ↓
Retrieve Relevant Records from MongoDB (Profile, Skills, Projects, Education, Experience, Achievements)
   ↓
Build a Plain-Text, Bounded Context Block
   ↓
Groq LLM — system prompt instructs it to answer ONLY from the supplied context
   ↓
Grounded Answer Returned to the Frontend
```

The retrieval layer in `backend/src/services/retrievalService.js` is intentionally simple (keyword/category matching) for v1, but is structured so it can later be swapped for embeddings, a vector database, or full RAG without changing the controller or the Groq service.

If a category has no records in MongoDB (e.g. no internship data), the retrieval layer explicitly tells the LLM "no records exist" — this is what allows the assistant to say *"I don't have that information in Srinjoy's profile"* instead of guessing.

## Security Considerations

- Groq API key and MongoDB URI live only in backend environment variables — never exposed to the browser.
- The frontend can only reach Groq indirectly, through `/api/chat`.
- `express-validator` enforces message length limits and sanitizes input.
- `express-rate-limit` throttles the general API, the chat endpoint (stricter), and the contact form.
- `helmet` sets protective HTTP headers; `cors` restricts origins to `CLIENT_URL`.
- Centralized error handling never leaks stack traces, API keys, or internal errors to visitors.
- Admin endpoints are gated behind a shared-secret header (`x-admin-secret`) and are disabled unless `ADMIN_SECRET` is set — upgrade to full authentication if the admin surface grows.
