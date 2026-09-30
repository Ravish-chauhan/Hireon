const mongoose = require("mongoose");

// ===================================
// DSA Execution Schema
// ===================================

const dsaExecutionSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAInterview",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAProblem",
      required: true,
    },
    executionMode: {
      type: String,
      enum: ["run", "submit"],
      required: true,
    },
    programmingLanguage: {
      type: String,
      required: true,
    },
    candidateCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "queued",
        "running",
        "completed",
        "passed",
        "failed",
        "compile_error",
        "runtime_error",
        "time_limit_exceeded",
        "memory_limit_exceeded",
        "output_limit_exceeded",
        "system_error",
      ],
      default: "queued",
      index: true,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const DSAExecution = mongoose.model("DSAExecution", dsaExecutionSchema);

module.exports = DSAExecution;
module.exports.DSAExecution = DSAExecution;
