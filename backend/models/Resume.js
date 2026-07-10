const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  templateId: { type: String, required: true }, // Figma template ID
  originalData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }, // Original form data from user
  enhancedData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }, // AI-enhanced resume data
  filledTemplate: {
    type: mongoose.Schema.Types.Mixed
  }, // Template filled with enhanced data
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  aiPrompt: String, // The AI prompt used for generation
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);