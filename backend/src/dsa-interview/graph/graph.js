const { START, END, StateGraph } = require("@langchain/langgraph");
const DSAInterviewState = require("./state");
const { isTerminal } = require("../services/stateMachine");
const {
  startNode,
  introductionNode,
  problemPresentationNode,
  understandingNode,
  approachDiscussionNode,
  approachReviewNode,
  codingNode,
  testingNode,
  debuggingNode,
  complexityNode,
  evaluationNode,
} = require("./nodes");

// ===================================
// Phase Router
// ===================================
// Routes to the node matching the current interview phase.
// The "start" action or START phase triggers startNode.
// All other routing is based on currentPhase.

function phaseRouter(state) {
  if (state.action === "start" || state.currentPhase === "START") {
    return "start";
  }

  if (isTerminal(state.currentPhase)) {
    return END;
  }

  switch (state.currentPhase) {
    case "INTRODUCTION":
      return "introduction";
    case "PROBLEM_PRESENTATION":
      return "problemPresentation";
    case "UNDERSTANDING":
      return "understanding";
    case "APPROACH_DISCUSSION":
      return "approachDiscussion";
    case "APPROACH_REVIEW":
      return "approachReview";
    case "CODING":
      return "coding";
    case "TESTING":
      return "testing";
    case "DEBUGGING":
      return "debugging";
    case "COMPLEXITY":
      return "complexity";
    case "FINAL_EVALUATION":
      return "finalEvaluation";
    default:
      return END;
  }
}

// ===================================
// DSA Interview Graph
// ===================================
// Single-step-per-invocation pattern:
// The controller invokes the graph once per message.
// The phaseRouter dispatches to the correct node.
// The node processes, validates the transition via
// the state machine, and returns to END.
// The controller persists the result and waits
// for the next message.

const dsaGraph = new StateGraph(DSAInterviewState)
  // --- Nodes ---
  .addNode("start", startNode)
  .addNode("introduction", introductionNode)
  .addNode("problemPresentation", problemPresentationNode)
  .addNode("understanding", understandingNode)
  .addNode("approachDiscussion", approachDiscussionNode)
  .addNode("approachReview", approachReviewNode)
  .addNode("coding", codingNode)
  .addNode("testing", testingNode)
  .addNode("debugging", debuggingNode)
  .addNode("complexity", complexityNode)
  .addNode("finalEvaluation", evaluationNode)

  // --- Entry: Router dispatches to the correct node ---
  .addConditionalEdges(START, phaseRouter, {
    start: "start",
    introduction: "introduction",
    problemPresentation: "problemPresentation",
    understanding: "understanding",
    approachDiscussion: "approachDiscussion",
    approachReview: "approachReview",
    coding: "coding",
    testing: "testing",
    debugging: "debugging",
    complexity: "complexity",
    finalEvaluation: "finalEvaluation",
    [END]: END,
  })

  // --- All nodes terminate after one step ---
  .addEdge("start", END)
  .addEdge("introduction", END)
  .addEdge("problemPresentation", END)
  .addEdge("understanding", END)
  .addEdge("approachDiscussion", END)
  .addEdge("approachReview", END)
  .addEdge("coding", END)
  .addEdge("testing", END)
  .addEdge("debugging", END)
  .addEdge("complexity", END)
  .addEdge("finalEvaluation", END)

  .compile();

module.exports = dsaGraph;
