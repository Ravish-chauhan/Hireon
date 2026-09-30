const feedbackAgent = require("../agents/feedback.agent");
const interviewAgent = require("../agents/interview.agent");
const summaryAgent = require("../agents/summary.agent");

// ------------------------------------------------
// Interview Node
// ------------------------------------------------

async function interviewNode(state) {
  const questions = await interviewAgent({
    type: state.type,
    role: state.role,
    useResume: state.useResume,
    resume: state.resume,
  });

  return { questions };
}

// ------------------------------------------------
// Feedback Node
// ------------------------------------------------

async function feedbackNode(state) {
  const feedback = await feedbackAgent({
    question: state.question,
    answer: state.answer,
    difficulty: state.difficulty,
  });

  return { feedback };
}

// ------------------------------------------------
// Summary Node
// ------------------------------------------------

async function summaryNode(state) {
  const report = await summaryAgent({
    role: state.role,
    type: state.type,
    questions: state.questions,
  });

  return { report };
}

module.exports = { interviewNode, feedbackNode, summaryNode };
