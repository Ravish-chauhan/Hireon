const fs = require('fs');
const path = require('path');

// Load GMAT question banks
const gmatQuant = require('../data/gmat-quant.json');
const gmatVerbal = require('../data/gmat-verbal.json');
const gmatDataInsight = require('../data/gmat-datainsight.json');

const GMAT_SUBJECTS = {
  'Quant': gmatQuant.questions,
  'Verbal': gmatVerbal.questions,
  'Data Insight': gmatDataInsight.questions
};

// Convert difficulty strings to numbers
const DIFFICULTY_MAP = {
  'easy': 1,
  'medium': 3,
  'hard': 5
};

// Convert answer format from object to array index
function convertAnswerFormat(question) {
  if (typeof question.options === 'object' && !Array.isArray(question.options)) {
    // Convert options object to array
    const optionsArray = Object.values(question.options);
    const optionKeys = Object.keys(question.options);
    
    // Find correct answer index
    const correctAnswerIndex = optionKeys.indexOf(question.answer);
    
    return {
      ...question,
      options: optionsArray,
      correctAnswerIndex: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      difficulty: DIFFICULTY_MAP[question.difficulty] || 3
    };
  }
  
  return {
    ...question,
    correctAnswerIndex: 0,
    difficulty: DIFFICULTY_MAP[question.difficulty] || 3
  };
}

// Get questions by subject and difficulty
function getQuestionsByDifficulty(subject, difficulty) {
  const questions = GMAT_SUBJECTS[subject] || [];
  const difficultyStr = Object.keys(DIFFICULTY_MAP).find(key => DIFFICULTY_MAP[key] === difficulty) || 'medium';
  
  return questions.filter(q => q.difficulty === difficultyStr);
}

// Get random question from question bank
function getRandomQuestionFromBank(subject, difficulty) {
  const questions = getQuestionsByDifficulty(subject, difficulty);
  
  if (questions.length === 0) {
    console.log(`⚠️ No questions found for ${subject} with difficulty ${difficulty}`);
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  const selectedQuestion = questions[randomIndex];
  
  console.log(`📚 Selected question from bank: ${subject} - ${selectedQuestion.difficulty} - ${selectedQuestion.id}`);
  
  return convertAnswerFormat(selectedQuestion);
}

// Get balanced questions for assessment (5 from each subject)
function getBalancedGMATQuestions() {
  const subjects = ['Quant', 'Verbal', 'Data Insight'];
  const difficulties = [1, 3, 3, 5, 5]; // 1 easy, 2 medium, 2 hard per subject
  const selectedQuestions = [];
  
  subjects.forEach(subject => {
    difficulties.forEach(difficulty => {
      const question = getRandomQuestionFromBank(subject, difficulty);
      if (question) {
        selectedQuestions.push({
          ...question,
          subject: subject,
          calculatedDifficulty: difficulty
        });
      }
    });
  });
  
  // Shuffle the questions
  for (let i = selectedQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
  }
  
  console.log(`🎯 Generated ${selectedQuestions.length} balanced GMAT questions`);
  console.log('Distribution per subject: 1 easy, 2 medium, 2 hard');
  return selectedQuestions;
}

module.exports = {
  getRandomQuestionFromBank,
  getBalancedGMATQuestions,
  GMAT_SUBJECTS,
  DIFFICULTY_MAP
};