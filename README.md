# 🚀 PlanoraAI

PlanoraAI is a premium, high-fidelity project planner and engineering mentor designed to help students, developers, and makers map out and execute their technical ideas. Functioning as **two distinct workflows inside a single platform**, PlanoraAI caters to both software development teams and hardware/electronics engineering labs.

---

### Technology Badges
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)

---

## 📌 Project Overview
PlanoraAI provides a workspace to break down complex project concepts into structured, AI-generated technical documentation. Leveraging advanced Large Language Models, the platform generates complete implementation plans, custom roadmaps, hardware Bill of Materials (BOM), circuit signal paths, firmware requirements, academic literature surveys, and deployment guides. 

With built-in progress tracking (optimistic state syncs) and a high-fidelity flowable PDF document exporter, PlanoraAI serves as a start-to-finish mentor for college evaluations, hackathons, and product prototypes.

---

## 🎨 Dual Workflows
PlanoraAI separates software development and hardware engineering paradigms completely.

### 🧡 1. Software Workflow (AI SaaS Project Planner)
* **Visual Theme:** Vibrant Orange (`#F97316`) accents.
* **Intelligent Recommendations:** Curates frontend/backend stacks, cloud architectures, database paradigms, and DevOps toolchains.
* **Interactive SVG block maps:** Automatically diagrams nodes (clients, servers, databases, third-party APIs) and traces connection protocols.
* **SaaS Terminology:** Focuses on APIs, scaling models, code-splitting, version control workflows (Git/GitHub), and deployment configurations.

### 💙 2. Hardware Workflow (AI Electronics & IoT Engineering Mentor)
* **Visual Theme:** High-tech Cyan (`#06B6D4`) PCB-inspired accents.
* **Bill of Materials (BOM) & Budgeting:** Estimates component costs, lists required vs optional hardware, details component purposes, and suggests wiring roles.
* **Firmware Stack Logic:** Suggests appropriate SDK libraries and configurations (e.g. C++/Arduino headers like `#include <WiFi.h>` or ESP32/Raspberry Pi environments).
* **Circuit Flowcharting:** Generates orthogonal PCB-inspired circuit tracks with right-angled signal/telemetry paths.
* **Required Tools Directory:** Lists physical lab equipment (Multimeters, Soldering irons, Logic analyzers) with curve stats.
* **Safety Precautions:** Warns about voltage limits, logic shifts, AC insulation, and short circuits.

---

## ⚙️ Core System Features
* **AI Project Planner Wizard:** Guided wizard for project titles, target budgets, timelines, and technical paradigms.
* **Real-time Synchronization:** Shared React Context updates checkbox states, sidebar progress rings, and dashboard scoreboard cards instantly with optimistic UI rendering and backend fallbacks.
* **Interactive Architecture flowcharts:** Direct SVG rendering of system components with right-angled paths for PCB flows.
* **Academic Survey Comparison:** Prior art literature references list with limitation/advantage matrices and paper viva topics.
* **High-Fidelity Flowable PDF Exporter:** Generates print-ready vector PDF blueprints using `html2pdf.js`, automatically paginating sheets and applying high-contrast `pdf-mode` styles.

---

## 🛠️ Technology Stack
* **Frontend:**
  - React 19 (Functional Hooks & Refs)
  - TypeScript (Strict compilation checks)
  - TailwindCSS (Premium dark-mode and light-theme contrast systems)
  - Framer Motion (Smooth micro-animations & transitions)
  - html2pdf.js (Vector PDF rendering)
* **Backend:**
  - Node.js & Express (TypeScript server)
  - MongoDB & Mongoose (NoSQL storage, schemas, validation)
  - JWT (JSON Web Tokens auth system)
  - Groq SDK (High-speed Llama-3 AI code & blueprint generation)

---

## 📷 Screenshots
*Screenshots will be located inside the `/screenshots` folder.*

1. **User Authentication & Login**
   ![Login Page](screenshots/login_page.png)
2. **Student Dashboard & Project Status Board**
   ![Dashboard](screenshots/dashboard.png)
3. **Software SaaS Planner Workspace (Orange Theme)**
   ![Software Workflow](screenshots/software_workflow.png)
4. **Hardware & IoT Engineering Workspace (Cyan Theme)**
   ![Hardware Workflow](screenshots/hardware_workflow.png)
5. **Interactive System Architecture Map**
   ![Architecture Diagram](screenshots/architecture_diagram.png)
6. **AI Roadmap Checklist & PDF Blueprint Export**
   ![AI Roadmap](screenshots/ai_roadmap.png)

---

## 🚀 Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org) (v18+ recommended)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB server)
* [Groq API Key](https://console.groq.com)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/GreeshmaChowdary16/Planora-AI.git
cd Planora-AI
```

### Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_signing_secret
   GROQ_API_KEY=your_groq_api_token
   ```
4. Build the TypeScript server:
   ```bash
   npm run build
   ```
5. Launch the backend:
   - For development (with hot-reload):
     ```bash
     npm run dev
     ```
   - For production startup:
     ```bash
     npm run start
     ```

---

### Step 3: Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and specify your API backend endpoint:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Build the production bundle:
   ```bash
   npm run build
   ```
5. Launch the local development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## 📡 Production Deployment Guide

### Database (MongoDB Atlas)
* Provision a free M0 tier cluster on MongoDB Atlas.
* Whitelist IP access rules (or allow access from anywhere `0.0.0.0/0` for cloud platform nodes).
* Copy the connection string and configure `MONGODB_URI` on your hosting server.

### Backend Hosting (Render)
* Create a new Web Service on Render, linking your repository.
* Set the Root Directory to `backend`.
* Configure Build Command: `npm install && npm run build`.
* Configure Start Command: `npm run start`.
* Under environment variables, add `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `GROQ_API_KEY`.

### Frontend Hosting (Vercel / Netlify / Render)
* Create a new static site service, linking your repository.
* Set the Root Directory to `frontend`.
* Configure Build Command: `npm run build`.
* Configure Output Directory: `dist`.
* Add the environment variable `VITE_API_BASE_URL` pointing to your deployed backend domain (e.g. `https://your-backend-app.onrender.com/api`).

---

## 🔮 Future Improvements
* **Auto-Procurement System:** Integration with online electronics APIs (e.g. Robu, Quartz, Mouser) to auto-fill shopping carts with BOM items.
* **Firmware Playground:** A sandbox compiler inside the browser allowing students to check C++/Arduino code for syntax errors.
* **PCB Schematic Exporter:** Auto-compiling layout configurations into KiCad-readable schematics.
* **Team Collaboration Spaces:** Real-time multi-student planning syncs using WebSockets.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).
