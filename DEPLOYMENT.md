# 🚀 CareerPilot AI - Deployment Guide

This guide explains how to deploy **CareerPilot AI** to **Render** (Backend API) and **Render / Vercel** (Frontend UI).

---

## 📋 Environment Variables Overview

### 1. Backend (`backend/`)
| Variable | Required? | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Auto by Render | `5000` | Port the Express server listens on. Render provides this automatically. |
| `JWT_SECRET` | Recommended | `your_super_secret_jwt_key_2026` | Secret string used to sign and verify JWT authentication tokens. |
| `MONGODB_URI` | Optional | `mongodb+srv://user:pass@cluster.mongodb.net/careerpilot?retryWrites=true&w=majority` | MongoDB Atlas database URI. If omitted, app runs in fast in-memory store mode. |

### 2. Frontend (`frontend/`)
| Variable | Required? | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Yes (in Prod) | `https://your-backend.onrender.com/api` | The public URL of your deployed Render backend API. |

---

## 🛠️ Step 1: Deploy Backend on Render (Web Service)

1. Log in to **[Render.com](https://render.com/)**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `DevanshDecoder/career-pilot-ai`.
4. Configure the settings:
   - **Name**: `careerpilot-backend` (or your choice)
   - **Region**: Choose the closest region (e.g. Frankfurt, Singapore, Oregon)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   - `JWT_SECRET` = `careerpilot_super_secret_jwt_key_2026`
   - `MONGODB_URI` = *(Optional: Paste your MongoDB Atlas URI here, or leave empty for in-memory mode)*
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g. `https://careerpilot-backend.onrender.com`).
   - Test it by visiting: `https://careerpilot-backend.onrender.com/api/health`

---

## 🌐 Step 2: Deploy Frontend on Render (Static Site) or Vercel

### Option A: On Render (Static Site)
1. On **Render.com**, click **New +** -> **Static Site**.
2. Connect your GitHub repository: `DevanshDecoder/career-pilot-ai`.
3. Configure the settings:
   - **Name**: `careerpilot-ai`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://careerpilot-backend.onrender.com/api` *(Your Render backend URL with `/api`)*
5. Click **Deploy Static Site**.

### Option B: On Vercel
1. Log in to **[Vercel.com](https://vercel.com/)**.
2. Click **Add New...** -> **Project**.
3. Import `DevanshDecoder/career-pilot-ai`.
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://careerpilot-backend.onrender.com/api`
6. Click **Deploy**!
