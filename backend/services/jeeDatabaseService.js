const Question = require("../models/Question");

// Get balanced JEE MAINS questions from database with custom distribution per subject
async function getBalancedJEEQuestions() {
  try {
    let allQuestions = [];

    // Physics: 2 easy, 2 medium, 1 hard (5 total)
    const physicsEasy = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS",
        subject: "Physics",
        calculatedDifficulty: { $lte: 2.5 },
        isActive: true
      }},
      { $sample: { size: 2 } }
    ]);

    const physicsMedium = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS", 
        subject: "Physics",
        calculatedDifficulty: { $gt: 2.5, $lte: 3.5 },
        isActive: true
      }},
      { $sample: { size: 2 } }
    ]);

    const physicsHard = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS",
        subject: "Physics",
        calculatedDifficulty: { $gt: 3.5 },
        isActive: true
      }},
      { $sample: { size: 1 } }
    ]);

    // Chemistry: 1 easy, 2 medium, 2 hard (5 total)
    const chemistryEasy = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS",
        subject: "Chemistry",
        calculatedDifficulty: { $lte: 2.5 },
        isActive: true
      }},
      { $sample: { size: 1 } }
    ]);

    const chemistryMedium = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS", 
        subject: "Chemistry",
        calculatedDifficulty: { $gt: 2.5, $lte: 3.5 },
        isActive: true
      }},
      { $sample: { size: 2 } }
    ]);

    const chemistryHard = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS",
        subject: "Chemistry",
        calculatedDifficulty: { $gt: 3.5 },
        isActive: true
      }},
      { $sample: { size: 2 } }
    ]);

    // Mathematics: 4 medium, 1 hard (5 total) - no easy as per your requirement
    const mathsMedium = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS", 
        subject: "Mathematics",
        calculatedDifficulty: { $gt: 2.5, $lte: 3.5 },
        isActive: true
      }},
      { $sample: { size: 4 } }
    ]);

    const mathsHard = await Question.aggregate([
      { $match: {
        examType: "JEE MAINS",
        subject: "Mathematics",
        calculatedDifficulty: { $gt: 3.5 },
        isActive: true
      }},
      { $sample: { size: 1 } }
    ]);

    // Combine all questions
    allQuestions = [
      ...physicsEasy,
      ...physicsMedium,
      ...physicsHard,
      ...chemistryEasy,
      ...chemistryMedium,
      ...chemistryHard,
      ...mathsMedium,
      ...mathsHard
    ];

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
      chapter: q.topic, // Chapter is stored in topic field from migration
      explanation: q.explanation || ""
    }));

    // Shuffle the final question set for additional randomization
    for (let i = formattedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [formattedQuestions[i], formattedQuestions[j]] = [formattedQuestions[j], formattedQuestions[i]];
    }

    console.log(`🎯 Generated ${formattedQuestions.length} balanced JEE MAINS questions`);
    console.log('Distribution: Physics(2E,2M,1H), Chemistry(1E,2M,2H), Maths(4M,1H)');
    return formattedQuestions;

  } catch (error) {
    console.error("❌ Error fetching JEE MAINS questions from database:", error);
    return [];
  }
}

module.exports = {
  getBalancedJEEQuestions
};