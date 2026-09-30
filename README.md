# HireOn — AI-Powered Career & Technical Interview Platform

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![LangGraph](https://img.shields.io/badge/AI%20Orchestration-LangGraph%20%7C%20Groq-FF6F00)](https://langchain.com/)
[![Judge0](https://img.shields.io/badge/Execution%20Sandbox-Judge0-black)](https://judge0.com/)
[![Monaco Editor](https://img.shields.io/badge/Editor-Monaco%20IDE-blue)](https://microsoft.github.io/monaco-editor/)

**HireOn** is an enterprise-grade AI hiring and interview preparation platform. It combines an **ATS Resume Builder & Analyzer** with an **Autonomous Technical & DSA AI Interviewer** equipped with an **Isolated Multi-Language Code Execution Sandbox**.

---

## 🌟 Key Features

### 1. 📄 AI Resume Builder & ATS Analyzer
* **15+ Industry-Tailored Templates:** Clean, ATS-friendly templates designed for software engineers, product managers, and data analysts.
* **Instant ATS Gap Analysis:** Parses uploaded resumes, evaluates keyword relevancy against target job descriptions, and calculates match scores.
* **Smart Content Suggestions:** Generates impact-driven bullet points using generative AI to optimize resumes for automated applicant tracking systems.
* **Multi-Format Export:** Real-time client-side preview with instant export to PDF and DOCX.

### 2. 🤖 Autonomous Technical & DSA AI Interviewer
* **12-Phase Finite State Machine (LangGraph):** Guides candidates through structured interview rounds:
  `START` $\to$ `INTRODUCTION` $\to$ `PROBLEM_PRESENTATION` $\to$ `UNDERSTANDING` $\to$ `APPROACH_DISCUSSION` $\to$ `APPROACH_REVIEW` $\to$ `CODING` $\to$ `TESTING` $\to$ `DEBUGGING` $\to$ `COMPLEXITY` $\to$ `FINAL_EVALUATION` $\to$ `END`.
* **Approach Review Gate:** Prevents premature coding until the candidate presents a viable algorithm and correct time/space complexity.
* **Progressive Hint System:** Offers 3 tiers of non-revealing hints (Conceptual, Algorithmic, Edge Cases) based on candidate struggle.
* **Retest & Debugging Loop:** Feeds test failures back into the interview conversation, challenging candidates to debug failing edge cases without leaking internal test fixtures.

### 3. 🛡️ Secure Multi-Language Code Execution Engine
* **Physical Isolation via Judge0:** Candidate code is **never** executed inside the HireOn backend Node.js process (zero `eval`, zero `child_process`).
* **4 Supported Languages:** Native support for **Python 3.12**, **Java 17**, **C++ 17**, and **JavaScript (Node 22)**.
* **Run vs. Submit Modes:**
  * **Run Mode:** Executes against visible sample test cases for rapid developer iteration.
  * **Submit Mode:** Runs visible plus server-side hidden test cases, masking internal inputs/expected outputs to prevent test leakage.
* **Strict Sandbox Limits:**
  * CPU Time Limit: 3.0s per test case
  * Memory Limit: 128 MB
  * Output Limit: 20 KB (with automatic 4KB truncation preventing database BSON overflow)
  * Network Access: Disabled (`enable_network: false`)
  * Secret Containment: Zero access to host environment variables or backend database credentials.

### 4. 💻 Dual-Panel Monaco Editor Workspace
* **Integrated Web IDE:** Dual-panel workspace with problem description and interviewer chat on the left, Monaco code editor on the right.
* **Multi-Language Starter Code:** Pre-populated method templates with automated boilerplate I/O drivers.
* **Autosave & Session Recovery:** Debounced autosaving preserves candidate drafts across browser reloads.
* **Test Case Inspector:** Expandable drawer rendering test status, execution time, memory usage, and diff comparison.

---

## 🏗️ Architecture & Execution Flow

```text
                           Candidate Browser
                         (Monaco Code Editor)
                                   │
                                   ▼  Run / Submit Request
                         ┌───────────────────────┐
                         │   HireOn REST API     │
                         │  (JWT Auth & Validate)│
                         └──────────┬────────────┘
                                   │  Asynchronous (HTTP 202)
                                   ▼
                         ┌───────────────────────┐
                         │   Execution Service   │
                         │  (Provider Adapter)   │
                         └──────────┬────────────┘
                                   │  Multi-Language Harness
                                   ▼
                         ┌───────────────────────┐
                         │   Isolated Sandbox    │
                         │   (Judge0 Container)  │
                         │  • Network: Disabled  │
                         │  • CPU: 3.0s Max      │
                         │  • RAM: 128MB Max     │
                         └──────────┬────────────┘
                                   │  Raw Execution Result
                                   ▼
                         ┌───────────────────────┐
                         │   Result Normalizer   │
                         │ (Masks Hidden Tests)  │
                         └──────────┬────────────┘
                                   │  Normalized Result
                                   ▼
                         ┌───────────────────────┐
                         │   DSA State Machine   │
                         │ CODING → TESTING      │
                         │  ├─ All Pass: COMPLEXITY
                         │  └─ Fail: DEBUGGING   │
                         └──────────┬────────────┘
                                   │  Interviewer Prompt
                                   ▼
                         ┌───────────────────────┐
                         │ Phase 2 AI Interviewer│
                         │ (Groq LLM / LangGraph)│
                         └───────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, TailwindCSS, Monaco Editor (`@monaco-editor/react`), Axios |
| **Backend** | Node.js, Express.js 5, Mongoose / MongoDB, Redis (`ioredis`), JWT, Joi |
| **AI & Orchestration** | LangGraph (`@langchain/langgraph`), LangChain Core, Groq SDK (Llama 3.3) |
| **Sandbox Execution** | Judge0 Community Edition / Enterprise REST API |
| **Testing** | Node.js Test Runners, Assert, Custom DSA Mock Harnesses |

---

## 📂 Project Structure

```text
hireon/
├── backend/
│   ├── scripts/
│   │   ├── seedDSAProblems.js          # Seed initial problem bank
│   │   ├── testStateMachine.js         # Phase 1: State machine tests (10/10)
│   │   ├── testPhase2Ai.js             # Phase 2: AI interviewer tests (8/8)
│   │   ├── testPhase3Coding.js         # Phase 3: Coding workspace tests (10/10)
│   │   └── testPhase4Execution.js      # Phase 4: Secure execution tests (14/14)
│   └── src/
│       ├── ai-interview/               # Generic AI Interviewer module
│       ├── ats/                        # Resume parser & ATS analyzer
│       ├── dsa-interview/              # Dedicated DSA Interview Module
│       │   ├── configs/                # Groq / LLM client configuration
│       │   ├── controllers/            # Execution & session controllers
│       │   ├── graph/                  # LangGraph nodes & workflow graph
│       │   ├── models/                 # Interview, Problem, & Execution models
│       │   ├── prompts/                # Phase-specific system prompts
│       │   ├── routes/                 # Express API routes
│       │   └── services/               # State machine & execution engine
│       │       └── execution/          # Judge0 provider, harnesses & normalizer
│       └── index.js                    # Express application entrypoint
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ai-interview/           # Generic interview components
        │   ├── dsa-interview/          # Monaco editor & execution drawer
        │   ├── resume/                 # 15+ resume templates
        │   └── layout/                 # Global header, footer, navigation
        ├── pages/
        │   ├── dsa-interview/          # Dual-panel DSA workspace page
        │   ├── ai-interview/           # Technical / HR interview page
        │   └── HomePage.tsx            # Landing page
        ├── services/                   # API clients (DSA & AI Interview)
        └── types/                      # TypeScript domain models
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v18+ installed
* **MongoDB** instance running locally or via MongoDB Atlas
* **Redis** server running (optional; graceful fallback included)
* **Groq API Key** for AI interviewer intelligence

### 1. Clone the Repository
```bash
git clone https://github.com/Ravish-chauhan/Hireon.git
cd Hireon
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env based on example
cp .env.example .env
```

Configure your `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hireon
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
REDIS_URL=redis://localhost:6379

# Code Execution Sandbox (Defaults to public Judge0 CE if unset)
JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_API_KEY=
```

Seed the DSA problem bank:
```bash
npm run seed-dsa
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## 🧪 Verification & Test Suites

The platform features end-to-end automated test suites covering each phase with 100% pass rates:

```bash
cd backend

# Phase 1: DSA Interview State Machine Lifecycle (10/10)
npm run test:dsa

# Phase 2: AI Technical Interviewer & Prompt Guardrails (8/8)
npm run test:ai

# Phase 3: Monaco Coding Workspace & Persistence (10/10)
npm run test:coding

# Phase 4: Secure Code Execution Engine (14/14)
npm run test:execution
```

---

## 🔮 Future Roadmap

* **WebRTC Voice AI:** Real-time, hands-free conversational audio for behavioral and technical interviews.
* **3D Animated Avatar:** WebGL-rendered AI interviewer delivering synchronized facial expressions and speech.
* **System Design Whiteboard:** Collaborative architecture canvas with automated scalability evaluation.
* **Enterprise Analytics:** Granular candidate scoring rubrics across algorithm optimality, code readability, and debugging proficiency.

---

## 📄 License

This project is licensed under the ISC License.
