# 🤖 AI Interview Service

This directory contains the complete multi-agent interview service powered by **LangGraph** and **Groq (`llama-3.3-70b-versatile`)**.

For the full system design document, refer to [`../../AI_INTERVIEW_ARCHITECTURE.md`](file:///e:/hireon/AI_INTERVIEW_ARCHITECTURE.md).

## 📂 Directory Structure

```
backend/src/ai-interview/
├── agents/
│   ├── interview.agent.js     # Generates 6 progressive questions based on role & track
│   ├── feedback.agent.js      # Real-time multi-criteria evaluation of submitted answers
│   └── summary.agent.js       # Synthesizes final report, strengths, weaknesses & tips
├── configs/
│   └── llm.js                 # ChatGroq client (llama-3.3-70b-versatile, temp: 0.2)
├── controllers/
│   └── interview.controller.js# HTTP handlers: /start, /answer, /all, /:id
├── graph/
│   ├── graph.js               # Compiled StateGraph router & conditional edges
│   ├── nodes.js               # Agent wrapper nodes
│   └── state.js               # State annotation schema (channels)
├── model/
│   └── interview.model.js     # Mongoose schema for interviews & feedback
├── prompts/
│   ├── technicalInterviewPrompt.js # Senior Technical Interviewer prompt
│   ├── hrInterviewPrompt.js        # Senior HR / Behavioral prompt
│   ├── feedback.prompt.js          # 8-Criteria evaluation prompt
│   └── summary.prompt.js           # Final report synthesizer prompt
└── routes/
    └── interview.route.js     # Express router mounted at /api/interview
```

## ⚙️ Environment Variables Required

- `GROQ_API_KEY`: Groq Cloud API Key for LPU inference.
- `MONGO_URI`: MongoDB connection string.
- `REDIS_URL`: (Optional) Redis instance URL for caching dashboard metrics.

## 🚀 API Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/interview/start` | Starts new session and generates 6 questions | Yes (JWT) |
| `POST` | `/api/interview/answer` | Submits candidate answer & returns feedback | Yes (JWT) |
| `GET` | `/api/interview/all` | Returns user's interview history & analytics | Yes (JWT) |
| `GET` | `/api/interview/:id` | Returns single interview data or final report | Yes (JWT) |
