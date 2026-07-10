const Question = require('../models/Question');

/**
 * Get balanced MHCET questions from database
 * Returns 15 questions: 5 Physics, 5 Chemistry, 5 Mathematics
 */
async function getBalancedMHCETQuestions() {
  try {
    console.log('🔍 [MHCET] Fetching balanced questions from database...');
    
    // Debug: Check total MHCET questions first
    const totalMHCET = await Question.countDocuments({ examType: 'MHCET' });
    console.log(`📊 [MHCET] Total MHCET questions in DB: ${totalMHCET}`);
    
    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    const questionsPerSubject = 5;
    const allQuestions = [];

    for (const subject of subjects) {
      console.log(`📚 [MHCET] Fetching ${questionsPerSubject} ${subject} questions...`);
      
      // Debug: Check count first
      const count = await Question.countDocuments({
        examType: 'MHCET',
        subject: subject,
        isActive: true
      });
      console.log(`📊 [MHCET] ${subject} count in DB: ${count}`);
      
      const questions = await Question.find({
        examType: 'MHCET',
        subject: subject,
        isActive: true
      })
      .limit(questionsPerSubject)
      .lean();

      console.log(`✅ [MHCET] Found ${questions.length} ${subject} questions`);
      
      if (questions.length === 0) {
        console.warn(`⚠️ [MHCET] No ${subject} questions found in database`);
        continue;
      }

      // Transform to match expected format
      const transformedQuestions = questions.map(q => ({
        id: q.questionId,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        difficulty: q.difficulty,
        calculatedDifficulty: q.calculatedDifficulty,
        subject: q.subject,
        topic: q.topic || q.subject,
        explanation: q.explanation || '',
        tags: q.tags || []
      }));

      allQuestions.push(...transformedQuestions);
    }

    console.log(`🎯 [MHCET] Total questions prepared: ${allQuestions.length}`);
    
    // Shuffle questions to randomize order
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return allQuestions;
  } catch (error) {
    console.error('❌ [MHCET] Error fetching questions:', error);
    return [];
  }
}

module.exports = {
  getBalancedMHCETQuestions
};