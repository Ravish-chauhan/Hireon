require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Extract JSON safely with better error handling
function extractJSON(text) {
  try {
    // Try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, try parsing the entire text
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('JSON parsing failed:', error.message);
    console.error('Raw text:', text.substring(0, 500));
    return null;
  }
}
function cleanQuestionText(text) {
  if (!text) return "";

  return text
    .replace(/\$/g, "")           // remove $ signs
    .replace(/\\\(/g, "")         // remove LaTeX brackets
    .replace(/\\\)/g, "")
    .replace(/\\/g, "")         // remove markdown bold
    .replace(/`/g, "")            // remove backticks
    .replace(/_/g, " ")           // remove underscores
    .replace(/\\n/g, " ")         // remove escaped newlines
    .replace(/\s+/g, " ")         // fix spacing
    .trim();
}
const SYSTEM_INSTRUCTION = `
You are an expert exam question generator (JEE/NEET/CAT/GATE).
Rules:
- Only return valid JSON.
- No markdown or extra text.
- Explanation < 25 words.
- No chain of thought.
`;

// ======================================================
// 1️⃣ Generate Practice Question OR Explanation
// ======================================================
async function generatePracticeQuestion(examType, subject, difficulty, retryCount = 0, questionText = null) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    let prompt;

    if (questionText) {
      // Generate explanation for existing question
      prompt = `Generate a detailed explanation for this ${examType} ${subject} question:

"${questionText}"

Return ONLY valid JSON:
{"explanation":"detailed explanation in 20-30 words"}

CRITICAL RULES:
1. Explanation must be clear and educational
2. Keep explanation under 30 words
3. Focus on the solution approach`;
    } else {
      // Generate new question
      prompt = `Generate a ${examType} ${subject} MCQ (difficulty ${difficulty}/5). Return ONLY valid JSON:

{"question":"","options":["","","",""],"correctAnswerIndex":0,"explanation":"","difficulty":${difficulty},"topic":"${subject}"}

CRITICAL RULES:
1. correctAnswerIndex MUST match the actual correct option (0-3)
2. Double-check your answer before responding
3. Explanation must prove the correct answer
4. Explanation under 20 words
5. All calculations must be accurate`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("📝 Gemini response length:", text.length);

    const json = extractJSON(text);

    if (!json) {
      console.error("❌ Gemini invalid JSON:", text.substring(0, 500));

      // Retry with AI if JSON mismatch and retryCount < 2
      if (retryCount < 2) {
        console.log(`🔄 Retrying question generation (attempt ${retryCount + 2})...`);
        return await generatePracticeQuestion(examType, subject, difficulty, retryCount + 1, questionText);
      }

      throw new Error("Invalid JSON from Gemini after retries");
    }

    if (questionText) {
      // Return only explanation
      return {
        explanation: cleanQuestionText(json.explanation || 'Explanation not available')
      };
    }

    return {
      question: cleanQuestionText(json.question),
      options: json.options.map(opt => cleanQuestionText(opt)),
      correctAnswerIndex: json.correctAnswerIndex,
      explanation: cleanQuestionText(json.explanation),
      difficulty: json.difficulty,
      topic: json.topic
    };
  } catch (error) {
    console.error(`❌ Gemini error (attempt ${retryCount + 1}):`, error.message);

    // Retry with Gemini if retryCount < 2
    if (retryCount < 2) {
      console.log(`🔄 Retrying with Gemini (attempt ${retryCount + 2})...`);
      return await generatePracticeQuestion(examType, subject, difficulty, retryCount + 1, questionText);
    }

    throw error;
  }
}

// ======================================================
// 2️⃣ Assessment Analysis - AI + MANUAL DIFFICULTY OVERRIDE
// ======================================================
async function generateAssessmentAnalysis({ examType, attempts, score, totalQuestions }) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro"
    });

    // Calculate analytics
    const accuracyPercent = Math.round((score / totalQuestions) * 100);
    const topicStats = calculateTopicStats(attempts);
    const scoreRange = estimateExamScore(examType, accuracyPercent, {});

    // Calculate difficulty stats manually (override AI)
    const manualDifficultyStats = calculateDifficultyStats(attempts);
    console.log('🎯 Manual difficulty stats:', manualDifficultyStats);

    const prompt = `Analyze ${examType} assessment: ${score}/${totalQuestions} (${accuracyPercent}%).

Topic Performance:
${topicStats.map(t => `- ${t.topic}: ${t.accuracyPercent}%`).join('\n')}

Return ONLY this JSON structure:
{
  "overview": {
    "summary": "3-4 line summary of performance",
    "accuracyPercent": ${accuracyPercent}
  },
  "chartData": {
    "scoreDistribution": {
      "correct": ${score},
      "incorrect": ${totalQuestions - score - attempts.filter(a => a.selectedOption === null).length},
      "unattempted": ${attempts.filter(a => a.selectedOption === null).length}
    },
    "topicAccuracy": ${JSON.stringify(topicStats)}
  },
  "tentativeExamScore": {
    "examName": "${examType}",
    "estimatedScoreRange": "${scoreRange.range}",
    "confidenceLevel": "${scoreRange.confidence}",
    "note": "This is an indicative estimate, not an official score."
  },
  "strengths": ["max 3 bullet points, 15 words each"],
  "weaknesses": ["max 3 bullet points, 15 words each"],
  "recommendations": ["max 4 actionable points, 20 words each"],
  "nextActionPlan": {
    "focusAreas": ["2-3 immediate focus areas"],
    "practiceStrategy": ["2-3 practice methods"],
    "avoid": ["1-2 things to avoid"]
  }
}

Rules:
- Keep all text concise and exam-focused
- No motivational language
- Focus on actionable insights
- Each section max 60 words total`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = extractJSON(text);

    if (!json) throw new Error("Invalid analysis JSON");

    // Override AI difficulty stats with our manual calculation
    json.chartData.difficultyAccuracy = manualDifficultyStats;
    console.log('✅ Final analysis with manual difficulty override:', json.chartData.difficultyAccuracy);

    return json;
  } catch (error) {
    console.error("❌ Analysis error:", error.message);

    // Fallback structure with manual difficulty stats
    const manualDifficultyStats = calculateDifficultyStats(attempts);
    return {
      overview: {
        summary: `Completed ${examType} assessment with ${Math.round((score / totalQuestions) * 100)}% accuracy. Performance analysis shows areas for improvement in conceptual understanding and problem-solving speed.`,
        accuracyPercent: Math.round((score / totalQuestions) * 100)
      },
      chartData: {
        scoreDistribution: {
          correct: score,
          incorrect: totalQuestions - score - attempts.filter(a => a.selectedOption === null).length,
          unattempted: attempts.filter(a => a.selectedOption === null).length
        },
        difficultyAccuracy: manualDifficultyStats,
        topicAccuracy: calculateTopicStats(attempts)
      },
      tentativeExamScore: {
        examName: examType,
        estimatedScoreRange: estimateExamScore(examType, Math.round((score / totalQuestions) * 100), {}).range,
        confidenceLevel: "Medium",
        note: "This is an indicative estimate, not an official score."
      },
      strengths: ["Consistent performance in attempted questions"],
      weaknesses: ["Need improvement in accuracy and speed"],
      recommendations: ["Focus on weak topics", "Practice more questions"],
      nextActionPlan: {
        focusAreas: ["Weak topic revision", "Speed improvement"],
        practiceStrategy: ["Daily practice", "Mock tests"],
        avoid: ["Overconfidence"]
      }
    };
  }
}

// Helper functions
function calculateDifficultyStats(attempts) {
  // Filter out only answered questions for difficulty analysis
  const answeredAttempts = attempts.filter(a => a.selectedOption !== null);

  console.log('🔍 Difficulty analysis debug:');
  console.log('Total attempts:', attempts.length);
  console.log('Answered attempts:', answeredAttempts.length);

  // Log each attempt with all difficulty data
  answeredAttempts.forEach((attempt, index) => {
    console.log(`Question ${index + 1}:`, {
      difficultyAtAttempt: attempt.difficultyAtAttempt,
      questionDataDifficulty: attempt.questionData?.difficulty,
      isCorrect: attempt.isCorrect,
      selectedOption: attempt.selectedOption
    });
  });

  console.log('Difficulty values (difficultyAtAttempt):', answeredAttempts.map(a => a.difficultyAtAttempt));
  console.log('Difficulty values (questionData.difficulty):', answeredAttempts.map(a => a.questionData?.difficulty));

  if (answeredAttempts.length === 0) {
    console.log('⚠️ No answered questions for difficulty analysis');
    return { easy: 0, medium: 0, hard: 0 };
  }

  // Use fixed thresholds for better categorization
  const easy = answeredAttempts.filter(a => a.difficultyAtAttempt <= 2.5);
  const medium = answeredAttempts.filter(a => a.difficultyAtAttempt > 2.5 && a.difficultyAtAttempt <= 3.5);
  const hard = answeredAttempts.filter(a => a.difficultyAtAttempt > 3.5);

  const easyCorrect = easy.filter(a => a.isCorrect).length;
  const mediumCorrect = medium.filter(a => a.isCorrect).length;
  const hardCorrect = hard.filter(a => a.isCorrect).length;

  const easyPercent = easy.length ? Math.round((easyCorrect / easy.length) * 100) : 0;
  const mediumPercent = medium.length ? Math.round((mediumCorrect / medium.length) * 100) : 0;
  const hardPercent = hard.length ? Math.round((hardCorrect / hard.length) * 100) : 0;

  console.log(`📊 Difficulty distribution (${answeredAttempts.length} answered questions):`);
  console.log(`Easy (≤2.5): ${easy.length} questions (${easyCorrect} correct) = ${easyPercent}%`);
  console.log(`Medium (2.5-3.5): ${medium.length} questions (${mediumCorrect} correct) = ${mediumPercent}%`);
  console.log(`Hard (>3.5): ${hard.length} questions (${hardCorrect} correct) = ${hardPercent}%`);

  const result = {
    easy: easyPercent,
    medium: mediumPercent,
    hard: hardPercent
  };

  console.log('🎯 Final difficulty stats:', result);
  return result;
}

function calculateTopicStats(attempts) {
  const topicMap = {};
  attempts.forEach(attempt => {
    const topic = attempt.topic || 'General';
    if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
    topicMap[topic].total++;
    if (attempt.isCorrect) topicMap[topic].correct++;
  });

  return Object.entries(topicMap).map(([topic, stats]) => ({
    topic,
    accuracyPercent: Math.round((stats.correct / stats.total) * 100)
  }));
}

function estimateExamScore(examType, accuracy, difficultyStats) {
  let baseScore = accuracy;

  // Adjust based on difficulty performance
  if (difficultyStats.hard > 70) baseScore += 5;
  else if (difficultyStats.hard < 30) baseScore -= 10;

  if (difficultyStats.easy < 80) baseScore -= 5;

  // Conservative estimation
  const minScore = Math.max(0, baseScore - 15);
  const maxScore = Math.min(100, baseScore + 10);

  const confidence = accuracy > 70 ? "High" : accuracy > 50 ? "Medium" : "Low";

  return {
    range: `${minScore}-${maxScore}%`,
    confidence
  };
}

module.exports = {
  generatePracticeQuestion,
  generateAssessmentAnalysis
};