const mongoose = require('mongoose');
const Question = require('../models/Question');

async function testMHCETQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edunia');
    console.log('📡 Connected to MongoDB');

    // Test MHCET question counts
    const physicsCount = await Question.countDocuments({ examType: 'MHCET', subject: 'Physics' });
    const chemistryCount = await Question.countDocuments({ examType: 'MHCET', subject: 'Chemistry' });
    const mathsCount = await Question.countDocuments({ examType: 'MHCET', subject: 'Mathematics' });
    const totalCount = await Question.countDocuments({ examType: 'MHCET' });

    console.log('📊 MHCET Question Counts:');
    console.log(`   Physics: ${physicsCount}`);
    console.log(`   Chemistry: ${chemistryCount}`);
    console.log(`   Mathematics: ${mathsCount}`);
    console.log(`   Total: ${totalCount}`);

    // Test sample questions
    const sampleQuestions = await Question.find({ examType: 'MHCET' }).limit(3);
    console.log('\n📚 Sample MHCET Questions:');
    sampleQuestions.forEach((q, index) => {
      console.log(`${index + 1}. [${q.subject}] ${q.question.substring(0, 80)}...`);
      console.log(`   Options: ${q.options.length} | Difficulty: ${q.difficulty} | Active: ${q.isActive}`);
    });

    // Test balanced question selection (similar to service)
    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    const questionsPerSubject = 5;
    const balancedQuestions = [];

    for (const subject of subjects) {
      const questions = await Question.find({
        examType: 'MHCET',
        subject: subject,
        isActive: true
      }).limit(questionsPerSubject);
      
      console.log(`\n🔍 ${subject}: Found ${questions.length} questions`);
      balancedQuestions.push(...questions);
    }

    console.log(`\n✅ Balanced selection: ${balancedQuestions.length} total questions`);
    console.log('🎯 MHCET questions are ready for assessment!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run test if called directly
if (require.main === module) {
  testMHCETQuestions();
}

module.exports = { testMHCETQuestions };