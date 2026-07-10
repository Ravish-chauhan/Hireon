const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '.env') });
const mongoose = require("mongoose");
const Question = require("./models/Question");

// Import migration functions
const { migrateQuestions: migrateGMAT } = require('./scripts/migrateGMATQuestions');
const { migrateQuestions: migrateJEE } = require('./scripts/migrateJEEQuestions');

async function setupProductionDatabase() {
  try {
    console.log("🚀 Starting production database setup...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if questions already exist
    const gmatCount = await Question.countDocuments({ examType: "GMAT" });
    const jeeCount = await Question.countDocuments({ examType: "JEE MAINS" });
    
    console.log(`📊 Current question counts: GMAT=${gmatCount}, JEE=${jeeCount}`);

    // Migrate GMAT questions if needed
    if (gmatCount === 0) {
      console.log("📥 Migrating GMAT questions...");
      await migrateGMAT();
    } else {
      console.log("✅ GMAT questions already exist");
    }

    // Migrate JEE questions if needed
    if (jeeCount === 0) {
      console.log("📥 Migrating JEE questions...");
      await migrateJEE();
    } else {
      console.log("✅ JEE questions already exist");
    }

    // Final verification
    const finalGmatCount = await Question.countDocuments({ examType: "GMAT" });
    const finalJeeCount = await Question.countDocuments({ examType: "JEE MAINS" });
    
    console.log(`🎯 Final question counts: GMAT=${finalGmatCount}, JEE=${finalJeeCount}`);
    console.log("✅ Production database setup completed!");

  } catch (error) {
    console.error("❌ Production setup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run setup
setupProductionDatabase();