const mongoose = require('mongoose');

const resumeDraftSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, default: 'Untitled Resume' },
  template: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumeDraft', resumeDraftSchema);
