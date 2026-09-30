const llm = require("../configs/llm");
const hrInterviewPrompt = require("../prompts/hrInterviewPrompt");
const technicalInterviewPrompt = require("../prompts/technicalInterviewPrompt");

async function interviewAgent(data) {
  const prompt =
    data.type?.toLowerCase() === "hr"
      ? hrInterviewPrompt(data)
      : technicalInterviewPrompt(data);

  const response = await llm.invoke(prompt);

  try {
    const cleaned = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.log("Interview Agent Parse Error");
    console.log(response.content);

    throw new Error("Failed to generate interview questions.");
  }
}

module.exports = interviewAgent;
