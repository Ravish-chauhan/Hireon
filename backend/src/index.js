require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const path = require("path");

const resumeRoutes = require('./routes/resumeRoutes');
const analyseResumeRoutes = require('./routes/analyseResumeRoutes');
const documentGenerationRoutes = require('./routes/documentGeneration');
const aiRoutes = require('./routes/aiRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const jobRoutes = require('./routes/jobRoutes');
const interviewRoutes = require('./ai-interview/routes/interview.route');
const dsaInterviewRoutes = require('./dsa-interview/routes/dsaInterview.route');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/resumes', analyseResumeRoutes);
app.use('/api/ai', documentGenerationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api', jobRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dsa-interview', dsaInterviewRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Server will continue running without MongoDB");
  });

// Test route
app.get("/", (req, res) => {
  res.send("Resume Builder & Analyser Backend Ready");
});

// Health check for production
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
