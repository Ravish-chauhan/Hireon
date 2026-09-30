const { START, END, StateGraph } = require("@langchain/langgraph");
const InterviewState = require("./state");
const { interviewNode, feedbackNode, summaryNode } = require("./nodes");

// -------------------------------------
// Router
// -------------------------------------

function router(state) {
  switch (state.action) {
    case "start":
      return "interviewAgent";
    case "feedback":
      return "feedbackAgent";
    default:
      return END;
  }
}

// -------------------------------------
// Feedback Router
// -------------------------------------

function feedbackRouter(state) {
  if (state.completed) {
    return "summaryAgent";
  }
  return END;
}

// -------------------------------------
// Graph
// -------------------------------------

const graph = new StateGraph(InterviewState)
  // Nodes
  .addNode("interviewAgent", interviewNode)
  .addNode("feedbackAgent", feedbackNode)
  .addNode("summaryAgent", summaryNode)

  // START
  .addConditionalEdges(START, router, {
    interviewAgent: "interviewAgent",
    feedbackAgent: "feedbackAgent",
  })

  // Interview -> END
  .addEdge("interviewAgent", END)

  // Feedback -> Summary OR END
  .addConditionalEdges("feedbackAgent", feedbackRouter, {
    summaryAgent: "summaryAgent",
    [END]: END,
  })

  // Summary -> END
  .addEdge("summaryAgent", END)

  .compile();

module.exports = graph;
