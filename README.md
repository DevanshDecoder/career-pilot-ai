# 🚀 CareerPilot AI - Full-Stack Platform

CareerPilot AI is an all-in-one AI career advancement platform built with React, Tailwind CSS, Node.js, Express.js, JWT Authentication, and an advanced ATS NLP Resume Engine.

---

## 📁 Unified Project Folder Structure

Everything is contained in this **single unified folder**:

```
career-pilot-ai/
├── start.bat                 <-- ⚡ 1-Click launcher script (Double-click to start!)
├── package.json              <-- Root monorepo configuration with single-command scripts
├── README.md                 <-- Full project guide & documentation
├── frontend/                 <-- React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/       <-- Navbar, Dashboard, ResumeAnalyzer, MockInterview, SkillRoadmap, AuthModal
│   │   ├── services/         <-- API client helper & PDF text parsing engine
│   │   ├── App.jsx           <-- Main Application
│   │   └── index.css         <-- Design system & Glassmorphism styles
│   └── package.json
└── backend/                  <-- Node.js + Express + JWT API Backend
    ├── routes/               <-- Auth (/api/auth) & AI (/api/ai) API endpoints
    ├── services/             <-- Multi-factor NLP ATS Resume Parser & Interview Evaluator
    ├── middleware/           <-- JWT authentication middleware
    ├── store/                <-- Data store & mock fallback
    └── server.js             <-- Express server on port 5000
```

---

## ⚡ How to Run from This Single Folder

### Option 1: 1-Click Launcher (Windows)
Double-click **`start.bat`** in this folder! It will automatically start both the backend API and frontend React app concurrently.

### Option 2: Command Line (Single Command)
Open a terminal inside this folder (`career-pilot-ai`) and run:

```bash
npm run dev
```

That's it! Both services will launch concurrently:
- **Frontend App**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
