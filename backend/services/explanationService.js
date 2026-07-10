require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate explanation for a specific question
async function generateExplanation(questionText, correctAnswer, options) {
  try {
    console.log('🔍 Starting explanation generation...');
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `Provide a clear, concise explanation for this GMAT question in 50-70 words.

Question: ${questionText}

Options: ${options ? options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join('\n') : 'Not provided'}

Correct Answer: ${correctAnswer}

Explain:
- What concept is tested
- Why this answer is correct
- Key reasoning steps

Keep it simple and direct without bold formatting or numbered lists:`;

    console.log('📝 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const explanation = result.response.text().trim();
    
    console.log('📝 Generated explanation:', explanation);
    return explanation || 'This answer is correct based on the key concept being tested. The solution requires analyzing the given information and applying logical reasoning to eliminate incorrect options.';
  } catch (error) {
    console.error('❌ Error generating explanation:', error.message);
    return 'This answer is correct based on the key concept being tested. The solution requires analyzing the given information and applying logical reasoning to eliminate incorrect options.';
  }
}

module.exports = {
  generateExplanation
};