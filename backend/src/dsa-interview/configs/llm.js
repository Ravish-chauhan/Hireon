require("dotenv").config();
const { ChatGroq } = require("@langchain/groq");

const dsaLlm = new ChatGroq({
  model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  temperature: 0.2,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = dsaLlm;
