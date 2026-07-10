const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '../.env') });
const mongoose = require("mongoose");
const fs = require("fs");
const Question = require("../models/Question");

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Load questions from JSON files
function loadQuestionsFromJSON() {
  const dataDir = path.join(__dirname, "../data");
  const files = [
    { file: "gmat-quant.json", subject: "Quant" },
    { file: "gmat-verbal.json", subject: "Verbal" }, 
    { file: "gmat-datainsight.json", subject: "Data-insight" }
  ];
  
  let allQuestions = [];
  let subjectCounts = {};
  
  files.forEach(({ file, subject }) => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const data = fileData.questions || fileData; // Handle both structures
      
      if (!Array.isArray(data)) {
        console.log(`⚠️ Invalid data structure in ${file}`);
        return;
      }
      
      data.forEach(q => {
        // Skip questions without ID
        if (!q.id) {
          console.log(`⚠️ Skipping question without ID in ${file}`);
          return;
        }
        
        // Convert difficulty string to number
        const difficultyMap = { 'easy': 1, 'medium': 3, 'hard': 5 };
        const difficultyNum = difficultyMap[q.difficulty] || 3;
        
        // Convert options object to array and find correct answer index
        let optionsArray, correctAnswerIndex;
        if (typeof q.options === 'object' && !Array.isArray(q.options)) {
          optionsArray = Object.values(q.options);
          const optionKeys = Object.keys(q.options);
          correctAnswerIndex = optionKeys.indexOf(q.answer);
        } else {
          optionsArray = q.options || [];
          correctAnswerIndex = 0;
        }
        
        allQuestions.push({
          questionId: q.id,
          examType: "GMAT",
          subject: subject,
          question: q.question,
          options: optionsArray,
          correctAnswerIndex: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
          difficulty: difficultyNum,
          calculatedDifficulty: difficultyNum,
          topic: q.topic || subject,
          explanation: q.explanation || "",
          tags: q.tags || [],
          isActive: true
        });
      });
      
      subjectCounts[subject] = data.length;
      console.log(`📚 Loaded ${data.length} ${subject} questions from ${file}`);
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });
  
  console.log(`📊 Total breakdown:`, subjectCounts);
  return allQuestions;
}

// Main migration function
async function migrateQuestions() {
  try {
    await connectDB();
    
    console.log("🗑️ Clearing existing GMAT questions...");
    await Question.deleteMany({ examType: "GMAT" });
    
    console.log("📥 Loading questions from JSON files...");
    const questions = loadQuestionsFromJSON();
    
    if (questions.length === 0) {
      console.log("⚠️ No questions found to migrate");
      return;
    }
    
    console.log("💾 Inserting questions into database...");
    
    // Insert questions one by one to identify any problematic ones
    let insertedCount = 0;
    for (const question of questions) {
      try {
        await Question.create(question);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Failed to insert question ${question.questionId}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully migrated ${insertedCount} out of ${questions.length} GMAT questions to database`);
    
    // Verify the migration by subject
    const count = await Question.countDocuments({ examType: "GMAT" });
    const quantCount = await Question.countDocuments({ examType: "GMAT", subject: "Quant" });
    const verbalCount = await Question.countDocuments({ examType: "GMAT", subject: "Verbal" });
    const dataInsightCount = await Question.countDocuments({ examType: "GMAT", subject: "Data-insight" });
    
    console.log(`🔍 Verification: ${count} total GMAT questions in database`);
    console.log(`   - Quant: ${quantCount} questions`);
    console.log(`   - Verbal: ${verbalCount} questions`);
    console.log(`   - Data Insight: ${dataInsightCount} questions`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateQuestions();
}

module.exports = { migrateQuestions };