const { Annotation } = require("@langchain/langgraph");

// ===================================
// DSA Interview LangGraph State
// ===================================
// Phase list is defined in stateMachine.js (single source of truth).
// This file defines the LangGraph state channels.

const DSAInterviewState = Annotation.Root({
  // --- Session Identity ---
  interviewId: Annotation(),
  userId: Annotation(),

  // --- Phase Control ---
  currentPhase: Annotation(),    // Current phase from DSA_PHASES
  action: Annotation(),          // 'start' | 'message'
  lastAction: Annotation(),      // Last action taken (from DSA_ACTIONS)

  // --- Problem ---
  problem: Annotation(),         // Full problem object from DB

  // --- Conversation ---
  conversationHistory: Annotation(),  // Array of { role, content, phase, timestamp }
  candidateMessage: Annotation(),     // Latest message from the candidate

  // --- Approach ---
  candidateApproach: Annotation(),    // Candidate's described approach
  approachStatus: Annotation(),       // 'pending' | 'discussing' | 'approved' | 'needs_revision'

  // --- Hints ---
  hintsUsed: Annotation(),      // Number of hints used
  hintLevel: Annotation(),      // Current hint level (0-3)

  // --- Code ---
  programmingLanguage: Annotation(),  // e.g. 'javascript', 'python'
  candidateCode: Annotation(),       // Candidate's submitted code

  // --- Testing ---
  testResults: Annotation(),    // Array of test case results
  testsPassed: Annotation(),    // Boolean flag indicating if all tests passed

  // --- Debugging ---
  debuggingAttempts: Annotation(),  // Number of debugging iterations

  // --- Complexity ---
  timeComplexity: Annotation(),     // Candidate's stated time complexity
  spaceComplexity: Annotation(),    // Candidate's stated space complexity

  // --- Evaluation ---
  evaluation: Annotation(),    // Final evaluation object

  // --- AI Response ---
  aiResponse: Annotation(),    // Latest response from the interviewer AI

  // --- Status ---
  status: Annotation(),        // 'in-progress' | 'completed' | 'abandoned'
});

module.exports = DSAInterviewState;
