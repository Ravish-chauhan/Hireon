require('dotenv').config();
const mongoose = require('mongoose');
const FigmaTemplate = require('./models/FigmaTemplate');
const { parseTemplates } = require('./services/figmaService');

async function importTemplates() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('Fetching templates from Figma...');
    const templates = await parseTemplates();
    console.log(`✅ Found ${templates.length} templates`);

    console.log('Clearing existing templates...');
    await FigmaTemplate.deleteMany({});
    console.log('✅ Cleared old templates');

    console.log('Saving new templates...');
    const saved = await FigmaTemplate.insertMany(templates);
    console.log(`✅ Saved ${saved.length} templates to database`);

    console.log('\n📋 Templates imported:');
    saved.forEach((t, i) => {
      console.log(`${i + 1}. ${t.name} (${t.width}x${t.height})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

importTemplates();
