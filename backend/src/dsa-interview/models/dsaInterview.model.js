const mongoose = require("mongoose");
const { DSA_PHASES } = require("../services/stateMachine");

// ===================================
// Conversation Message Schema
// ===================================

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["interviewer", "candidate"],
      required: true,
    },
    content: { type: String, required: true },
    phase: { type: String, enum: DSA_PHASES, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ===================================
// Test Result Schema
// ===================================

const testResultSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    expectedOutput: { type: String, default: "" },
    actualOutput: { type: String, default: "" },
    passed: { type: Boolean, default: false },
    status: { type: String, default: "" },
    error: { type: String, default: "" },
  },
  { _id: false }
);

// ===================================
// Evaluation Schema
// ===================================

const evaluationSchema = new mongoose.Schema(
  {
    problemSolving: { type: Number, default: 0, min: 0, max: 100 },
    codeQuality: { type: Number, default: 0, min: 0, max: 100 },
    communication: { type: Number, default: 0, min: 0, max: 100 },
    debugging: { type: Number, default: 0, min: 0, max: 100 },
    optimization: { type: Number, default: 0, min: 0, max: 100 },
    overallScore: { type: Number, default: 0, min: 0, max: 100 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    feedback: { type: String, default: "" },
    recommendation: {
      type: String,
      enum: ["strong_hire", "hire", "lean_hire", "lean_no_hire", "no_hire", ""],
      default: "",
    },
  },
  { _id: false }
);

// ===================================
// DSA Interview Session Schema
// ===================================

const dsaInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAProblem",
      required: true,
    },
    currentPhase: {
      type: String,
      enum: DSA_PHASES,
      default: "START",
    },
    lastAction: {
      type: String,
      default: "",
    },
    conversationHistory: { type: [messageSchema], default: [] },
    candidateApproach: { type: String, default: "" },
    approachStatus: {
      type: String,
      enum: ["pending", "discussing", "approved", "needs_revision", ""],
      default: "",
    },
    hintsUsed: { type: Number, default: 0 },
    hintLevel: { type: Number, default: 0, min: 0, max: 3 },
    programmingLanguage: { type: String, default: "javascript" },
    candidateCode: { type: String, default: "" },
    codeVersion: { type: Number, default: 1 },
    lastCodeSavedAt: { type: Date, default: null },
    executionStatus: {
      type: String,
      enum: [
        "idle",
        "saving",
        "saved",
        "pending",
        "queued",
        "running",
        "passed",
        "failed",
        "compile_error",
        "runtime_error",
        "time_limit_exceeded",
        "memory_limit_exceeded",
        "output_limit_exceeded",
        "system_error",
      ],
      default: "idle",
    },
    lastExecutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAExecution",
      default: null,
    },
    lastExecutionAt: {
      type: Date,
      default: null,
    },
    lastExecutionRequest: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    testResults: { type: [testResultSchema], default: [] },
    testsPassed: { type: Boolean, default: false },
    debuggingAttempts: { type: Number, default: 0 },
    timeComplexity: { type: String, default: "" },
    spaceComplexity: { type: String, default: "" },
    evaluation: { type: evaluationSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const DSAInterview = mongoose.model("DSAInterview", dsaInterviewSchema);

module.exports = { DSAInterview, DSA_PHASES };
