const mongoose = require("mongoose");

// ===================================
// Test Case Schema
// ===================================

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

// ===================================
// Starter Code Schema
// ===================================

const starterCodeSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    code: { type: String, required: true },
  },
  { _id: false }
);

// ===================================
// DSA Problem Schema
// ===================================

const dsaProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    topics: { type: [String], default: [], index: true },
    description: { type: String, required: true },
    constraints: { type: [String], default: [] },
    examples: { type: [testCaseSchema], default: [] },
    expectedApproaches: { type: [String], default: [] },
    optimalApproach: { type: String, default: "" },
    timeComplexity: { type: String, default: "" },
    spaceComplexity: { type: String, default: "" },
    starterCode: { type: [starterCodeSchema], default: [] },
    hints: { type: [String], default: [] },
    visibleTestCases: { type: [testCaseSchema], default: [] },
    hiddenTestCases: { type: [testCaseSchema], default: [] },
    // Metadata for future external imports (LeetCode, etc.)
    externalId: { type: String, default: null },
    source: {
      type: String,
      enum: ["manual", "leetcode", "import"],
      default: "manual",
    },
  },
  { timestamps: true }
);

const DSAProblem = mongoose.model("DSAProblem", dsaProblemSchema);

module.exports = DSAProblem;
