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
    { file: "jee-physics.json", subject: "Physics" },
    { file: "jee-chemistry.json", subject: "Chemistry" }, 
    { file: "jee-maths.json", subject: "Mathematics" }
  ];
  
  let allQuestions = [];
  let subjectCounts = {};
  
  files.forEach(({ file, subject }) => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const data = fileData.questions || fileData;
      
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
        const difficultyMap = { 'Easy': 1, 'Medium': 3, 'Hard': 5 };
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
          examType: "JEE MAINS",
          subject: subject,
          question: q.question,
          options: optionsArray,
          correctAnswerIndex: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
          difficulty: difficultyNum,
          calculatedDifficulty: difficultyNum,
          topic: q.chapter || subject,
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
    
    console.log("🗑️ Clearing existing JEE MAINS questions...");
    await Question.deleteMany({ examType: "JEE MAINS" });
    
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
    
    console.log(`✅ Successfully migrated ${insertedCount} out of ${questions.length} JEE MAINS questions to database`);
    
    // Verify the migration by subject
    const count = await Question.countDocuments({ examType: "JEE MAINS" });
    const physicsCount = await Question.countDocuments({ examType: "JEE MAINS", subject: "Physics" });
    const chemistryCount = await Question.countDocuments({ examType: "JEE MAINS", subject: "Chemistry" });
    const mathsCount = await Question.countDocuments({ examType: "JEE MAINS", subject: "Mathematics" });
    
    console.log(`🔍 Verification: ${count} total JEE MAINS questions in database`);
    console.log(`   - Physics: ${physicsCount} questions`);
    console.log(`   - Chemistry: ${chemistryCount} questions`);
    console.log(`   - Mathematics: ${mathsCount} questions`);
    
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