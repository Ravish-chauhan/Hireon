require("dotenv").config();
const { ChatGroq } = require("@langchain/groq");

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = llm;
