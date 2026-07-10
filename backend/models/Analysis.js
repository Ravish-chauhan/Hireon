const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "AnalyseResume", required: true },

  rawResume: { type: String, required: true },
  jobDescription: { type: String, default: null },
  jobRole: { type: String, default: null },

  
  overallScore: { type: Number, default: null },
  toneStyleScore: { type: Number, default: null },
  contentScore: { type: Number, default: null },
  structureScore: { type: Number, default: null },
  skillsScore: { type: Number, default: null },

  atsScore: { type: Number, default: null },
  readabilityScore: { type: Number, default: null },
  keywordMatchScore: { type: Number, default: null },

  summary: { type: String, default: "" },

  // ⭐ Accept ANY format that AI returns
  strengths: { type: Array, default: [] },
  weaknesses: { type: Array, default: [] },
  suggestedImprovements: { type: Array, default: [] },
  skillsToAdd: { type: Array, default: [] },
  missingKeywords: { type: Array, default: [] },
  criticalFixes: { type: Array, default: [] },

  sectionWiseFeedback: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  optimizedSummary: { type: String, default: "" },
  rewrittenResume: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now }
});

// 🚨 FIX for cached model conflict
module.exports = mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);