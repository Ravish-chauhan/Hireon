const mongoose = require("mongoose");

const AnalyseResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Cloudinary URL of uploaded resume
  fileUrl: { type: String, required: true },

  // Extracted text for AI processing
  extractedText: { type: String, required: true },

  // Latest analysis ref
  lastAnalysisId: { type: mongoose.Schema.Types.ObjectId, ref: "Analysis" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AnalyseResume", AnalyseResumeSchema);