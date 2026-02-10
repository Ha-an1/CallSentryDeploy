# CallSentry — AI Call Screening MVP

CallSentry is an AI-powered call screening MVP that simulates answering incoming calls on behalf of a user. It combines:

* **Conversational AI (Gemini)** for natural call handling
* **Fraud detection (DistilBERT)** to identify suspicious or scam-like behavior
* **Modern frontend (React + Vite)** for interactive demo
* **Lightweight deployment (ngrok + Vercel)** for zero-cost MVP hosting

This README explains **local setup**, **backend & frontend usage**, and **deployment**.

---

##  Repository Structure

```
CallSentry/
├─ backend/          # Flask + ML backend
├─ frontend/         # React + Vite frontend
├─ Datasets/         # (Optional) training / test data
├─ .gitignore
└─ README.md
```

---

# 🔧 Backend Setup (Flask + ML)

### 1️⃣ Prerequisites

* Python **3.9+**
* pip
* Virtual environment support

---

### 2️⃣ Setup Virtual Environment

```bash
cd backend
python -m venv .venv

# Activate
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ Torch is installed as **CPU-only** for free-tier compatibility.

---

### 4️⃣ Environment Variables

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
```

>  **Never commit `.env` files**

---

### 5️⃣ Run Backend Locally

```bash
python app.py
```

Expected output:

```
Running on http://127.0.0.1:5000
```

Test health endpoint:

```bash
curl http://127.0.0.1:5000/health
```

---

#  Expose Backend Publicly (ngrok)

This project uses **ngrok** to expose the local backend for demos.

### 1️⃣ Install ngrok

👉 [https://ngrok.com/download](https://ngrok.com/download)

(Optional but recommended: create a free account and add auth token)

```bash
ngrok config add-authtoken YOUR_TOKEN
```

---

### 2️⃣ Start Tunnel

With backend running on port `5000`:

```bash
ngrok http 5000
```

You’ll get a public URL like:

```
https://abcd-1234.ngrok-free.dev
```

This becomes your **backend API base URL**.

---

#  Frontend Setup (React + Vite)

### 1️⃣ Navigate to Frontend

```bash
cd frontend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variable (Frontend)

Create `.env` in `frontend/`:

```env
VITE_API_URL=https://abcd-1234.ngrok-free.dev
```

> ⚠️ Do **not** include `/chat` here — it’s added in code

---

### 4️⃣ Run Frontend Locally

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

Frontend will now communicate with the ngrok-exposed backend.

---

#  Frontend Deployment (Vercel)

### 1️⃣ Push Code to GitHub

Ensure `frontend/` is committed and pushed.

---

### 2️⃣ Create Vercel Project

1. Go to [https://vercel.com](https://vercel.com)
2. **New Project** → Import GitHub repo
3. **Root Directory** → select `frontend`
4. Framework → auto-detected (Vite)

---

### 3️⃣ Add Environment Variable on Vercel

**Project Settings → Environment Variables**

| Key            | Value                              |
| -------------- | ---------------------------------- |
| `VITE_API_URL` | `https://abcd-1234.ngrok-free.dev` |

> 🔁 If ngrok URL changes → update this value and **redeploy**

---

### 4️⃣ Deploy 

After deploy, you’ll get:

```
https://your-project.vercel.app
```

---

#  How the System Works

```
Browser (Vercel)
   ↓
Frontend (React)
   ↓
ngrok (HTTPS tunnel)
   ↓
Flask Backend
   ├─ DistilBERT Fraud Detection
   └─ Gemini AI Conversation
```

---

#  Notes & Limitations (MVP)

* ngrok URLs change on restart (expected)
* Not designed for production traffic
* ML model is CPU-based
* Demo-focused architecture

---

#  Future Improvements

* Persistent backend hosting (VM / Fly.io)
* Redis-based conversation memory
* HTTPS via custom domain
* GPU-backed inference
* Call transcript storage

---

##  MVP Status

* End-to-end working demo
* Zero-cost deployment
* Publicly accessible
* Production-ready architecture

---

**Built as an MVP to demonstrate AI-powered call screening and fraud detection.**
