const mongoose = require('mongoose');

const resumeTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['professional', 'creative', 'modern', 'minimalist', 'executive'], required: true },
  thumbnail: { type: String, required: true },
  structure: {
    layout: { type: String, enum: ['single-column', 'two-column', 'three-column'], default: 'single-column' },
    colors: {
      primary: String,
      secondary: String,
      text: String,
      background: String
    },
    fonts: {
      heading: String,
      body: String
    },
    sections: [{
      type: { type: String, enum: ['header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'] },
      order: Number,
      visible: { type: Boolean, default: true }
    }]
  },
  htmlTemplate: String,
  cssTemplate: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumeTemplate', resumeTemplateSchema);
