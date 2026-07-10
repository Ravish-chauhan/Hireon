const Question = require("../models/Question");

// Get balanced GMAT questions from database (1 easy, 2 medium, 2 hard per subject)
async function getBalancedGMATQuestions() {
  try {
    const subjects = ["Quant", "Verbal", "Data-insight"];
    const questionsPerSubject = 5; // 1 easy, 2 medium, 2 hard
    let allQuestions = [];

    for (const subject of subjects) {
      // Get questions by difficulty for each subject with randomization
      const easyQuestions = await Question.aggregate([
        { $match: {
          examType: "GMAT",
          subject: { $regex: new RegExp(subject, "i") },
          calculatedDifficulty: { $lte: 2.5 },
          isActive: true
        }},
        { $sample: { size: 1 } }
      ]);

      const mediumQuestions = await Question.aggregate([
        { $match: {
          examType: "GMAT", 
          subject: { $regex: new RegExp(subject, "i") },
          calculatedDifficulty: { $gt: 2.5, $lte: 3.5 },
          isActive: true
        }},
        { $sample: { size: 2 } }
      ]);

      const hardQuestions = await Question.aggregate([
        { $match: {
          examType: "GMAT",
          subject: { $regex: new RegExp(subject, "i") },
          calculatedDifficulty: { $gt: 3.5 },
          isActive: true
        }},
        { $sample: { size: 2 } }
      ]);

      // Combine questions for this subject
      const subjectQuestions = [
        ...easyQuestions,
        ...mediumQuestions, 
        ...hardQuestions
      ];

      allQuestions = allQuestions.concat(subjectQuestions);
    }

    // Convert to the format expected by the assessment system
    const formattedQuestions = allQuestions.map(q => ({
      id: q.questionId,
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      difficulty: q.difficulty,
      calculatedDifficulty: q.calculatedDifficulty,
      subject: q.subject,
      topic: q.topic,
      explanation: q.explanation || ""
    }));

    // Shuffle the final question set for additional randomization
    for (let i = formattedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [formattedQuestions[i], formattedQuestions[j]] = [formattedQuestions[j], formattedQuestions[i]];
    }

    return formattedQuestions;

  } catch (error) {
    console.error("❌ Error fetching GMAT questions from database:", error);
    return [];
  }
}

// Get random questions by exam type and difficulty
async function getQuestionsByDifficulty(examType, subject, difficulty, limit = 1) {
  try {
    const questions = await Question.find({
      examType,
      subject: { $regex: new RegExp(subject, "i") },
      calculatedDifficulty: { 
        $gte: difficulty - 0.5, 
        $lte: difficulty + 0.5 
      },
      isActive: true
    }).limit(limit);

    return questions.map(q => ({
      id: q.questionId,
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      difficulty: q.difficulty,
      calculatedDifficulty: q.calculatedDifficulty,
      subject: q.subject,
      topic: q.topic,
      explanation: q.explanation || ""
    }));

  } catch (error) {
    console.error("❌ Error fetching questions by difficulty:", error);
    return [];
  }
}

// Get total question count by exam type
async function getQuestionCount(examType) {
  try {
    return await Question.countDocuments({ examType, isActive: true });
  } catch (error) {
    console.error("❌ Error counting questions:", error);
    return 0;
  }
}

module.exports = {
  getBalancedGMATQuestions,
  getQuestionsByDifficulty,
  getQuestionCount
};