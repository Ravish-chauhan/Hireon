const mongoose = require('mongoose');
const ResumeTemplate = require('./models/ResumeTemplate');
const templates = require('./data/resumeTemplates.json');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await ResumeTemplate.deleteMany({});
    await ResumeTemplate.insertMany(templates);
    console.log('Templates seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
