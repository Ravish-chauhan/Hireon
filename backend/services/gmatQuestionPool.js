const fs = require('fs');
const path = require('path');

class GMATQuestionPool {
  constructor() {
    this.questions = {
      verbal: [],
      quant: [],
      datainsight: []
    };
    this.loadQuestions();
  }

  loadQuestions() {
    try {
      // Load all 3 GMAT JSON files
      const dataPath = path.join(__dirname, '../data');
      
      const verbal = JSON.parse(fs.readFileSync(path.join(dataPath, 'gmat-verbal.json'), 'utf8'));
      const quant = JSON.parse(fs.readFileSync(path.join(dataPath, 'gmat-quant.json'), 'utf8'));
      const datainsight = JSON.parse(fs.readFileSync(path.join(dataPath, 'gmat-datainsight.json'), 'utf8'));

      this.questions.verbal = verbal.questions || [];
      this.questions.quant = quant.questions || [];
      this.questions.datainsight = datainsight.questions || [];

      console.log(`📚 Loaded GMAT questions:`, {
        verbal: this.questions.verbal.length,
        quant: this.questions.quant.length,
        datainsight: this.questions.datainsight.length
      });
    } catch (error) {
      console.error('❌ Error loading GMAT questions:', error.message);
    }
  }

  // Get random questions by subject and difficulty
  getRandomQuestions(subject, difficulty, count = 6) {
    const pool = this.questions[subject.toLowerCase()] || [];
    const filtered = pool.filter(q => q.difficulty === difficulty);
    
    if (filtered.length === 0) {
      console.warn(`⚠️ No ${difficulty} questions found for ${subject}`);
      return [];
    }

    // Shuffle and pick random questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Get mixed questions for full GMAT assessment
  getMixedQuestions(difficulty, totalCount = 15) {
    const perSubject = Math.floor(totalCount / 3);
    const remainder = totalCount % 3;

    const questions = [
      ...this.getRandomQuestions('verbal', difficulty, perSubject + (remainder > 0 ? 1 : 0)),
      ...this.getRandomQuestions('quant', difficulty, perSubject + (remainder > 1 ? 1 : 0)),
      ...this.getRandomQuestions('datainsight', difficulty, perSubject)
    ];

    // Shuffle final mix
    return questions.sort(() => Math.random() - 0.5);
  }
}

module.exports = new GMATQuestionPool();