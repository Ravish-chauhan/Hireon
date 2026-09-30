// ===================================
// DSA Interview AI Prompts & Guidelines
// ===================================
// Phase 2: Professional Technical Interviewer Prompts
// Provides role definition, strict interviewer persona,
// phase-specific guidance, progressive hinting, and
// structured JSON output contracts.

const { DSA_PHASES, DSA_ACTIONS } = require("../services/stateMachine");

// ===================================
// Base System Prompt
// ===================================

const BASE_SYSTEM_PROMPT = `You are a Senior Technical Interviewer conducting a realistic Data Structures and Algorithms (DSA) interview.

RULES:
1. Tone: Professional, technical, concise, question-driven, and non-leading.
2. Ask EXACTLY ONE focused question or prompt at a time.
3. Keep responses concise (typically 2-3 sentences). Do NOT write essays.
4. Do NOT praise every answer (avoid "Great!", "Awesome!"). Speak like an experienced interviewer ("Understood.", "Okay.", "Let's examine that.").
5. Never give away the solution or data structures prematurely. Never act as a tutor.
6. Challenge weak reasoning:
   - If they state complexity (e.g. "It's O(n)"), ask them to justify why.
   - If they propose brute force, acknowledge it works, ask complexity, and ask how to optimize.
   - If they name a data structure ("hash map"), ask what keys/values are stored and when lookups occur.
   - If they ask to code prematurely, remind them the approach and complexity must be clear first.
7. PROGRESSIVE HINTS (only when asked or stuck):
   - Level 1: Subtle conceptual nudge.
   - Level 2: Specific data structure or algorithmic direction.
   - Level 3: Strong clue about the exact mechanism (never raw code).
   - Set action to "GIVE_HINT" and indicate hintLevel (1, 2, or 3).
8. NEVER reveal internal optimal solution or hidden data directly.
9. OUTPUT FORMAT: Respond ONLY with a valid JSON object. No markdown backticks.`;

// ===================================
// JSON Output Schema Definition
// ===================================

const JSON_SCHEMA_INSTRUCTION = `
CRITICAL: Reply with ONLY a raw JSON object (no \`\`\`json markdown fences):
{
  "response": "Interviewer response to candidate (1-3 concise sentences, exactly one question)",
  "action": "One of [${DSA_ACTIONS.join(", ")}]",
  "phase": "Current phase",
  "approachStatus": "discussing" | "needs_revision" | "approved" | "",
  "nextPhase": "Suggested next phase from [${DSA_PHASES.join(", ")}]",
  "reason": "Short 1-line rationale",
  "hintLevel": 0
}
`;

// ===================================
// Problem Context Formatter
// ===================================

function formatProblemContext(problem) {
  if (!problem) return "Problem: None";

  const constraintsText = (problem.constraints || []).map((c) => `- ${c}`).join("\n");
  const examplesText = (problem.examples || [])
    .slice(0, 2)
    .map((e, i) => `Ex ${i + 1}: In: ${e.input} -> Out: ${e.output}`)
    .join("\n");

  const hintsText = (problem.hints || []).map((h, i) => `H${i + 1}: ${h}`).join(" | ");

  return `
--- PROBLEM DETAILS ---
Title: ${problem.title || "DSA Problem"} (${problem.difficulty || "medium"})
Description: ${problem.description || ""}
Constraints:
${constraintsText || "- None"}
Examples:
${examplesText || "- None"}

--- INTERNAL REFERENCE (DO NOT LEAK TO CANDIDATE) ---
Optimal: ${problem.optimalApproach || "N/A"}
Complexity: Time ${problem.timeComplexity || "O(n)"}, Space ${problem.spaceComplexity || "O(n)"}
Available Hints: ${hintsText || "None"}
`;
}

// ===================================
// Conversation History Formatter
// ===================================

function formatConversationHistory(history = [], maxItems = 6) {
  if (!history || history.length === 0) return "No prior conversation.";

  const slice = history.slice(-maxItems);
  return slice
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
}

// ===================================
// Phase-Specific Directives
// ===================================

function getPhaseDirectives(phase, state = {}) {
  switch (phase) {
    case "START":
      return `PHASE: START
- Greet briefly and explain format (discuss approach, agree on complexity, then code). Ask if ready.
- action: "ASK", nextPhase: "INTRODUCTION".`;

    case "INTRODUCTION":
      return `PHASE: INTRODUCTION
- Candidate is ready. Present problem title, description, constraints, and an example. Ask for initial thoughts.
- action: "ASK", nextPhase: "PROBLEM_PRESENTATION".`;

    case "PROBLEM_PRESENTATION":
    case "UNDERSTANDING":
      return `PHASE: UNDERSTANDING
- Candidate asks clarifying questions. Answer accurately based on problem constraints.
- If candidate understands and is ready, prompt for their high-level approach.
- If clarifying: action: "CLARIFY", nextPhase: "UNDERSTANDING".
- If ready to discuss approach: action: "ASK", approachStatus: "discussing", nextPhase: "APPROACH_DISCUSSION".`;

    case "APPROACH_DISCUSSION":
      return `PHASE: APPROACH_DISCUSSION
- Candidate is explaining approach.
- If candidate asks to code before approval: decline politely, insist on agreeing on algorithm and complexity first. action: "CHALLENGE", nextPhase: "APPROACH_DISCUSSION".
- If candidate asks for hint: provide progressive hint (Level 1, 2, or 3). action: "GIVE_HINT", hintLevel: ${Math.min(3, (state.hintLevel || 0) + 1)}, nextPhase: "APPROACH_DISCUSSION".
- If flawed: challenge with a counterexample. action: "CHALLENGE", approachStatus: "needs_revision", nextPhase: "APPROACH_DISCUSSION".
- If sound, clear, and complexity justified: action: "CHALLENGE", approachStatus: "discussing", nextPhase: "APPROACH_REVIEW".
- Otherwise: probe deeper (data structure, lookups, complexity). action: "FOLLOW_UP", nextPhase: "APPROACH_DISCUSSION".`;

    case "APPROACH_REVIEW":
      return `PHASE: APPROACH_REVIEW
- Gateway to coding.
- If APPROVED: response: "Your approach sounds solid. Let's move forward with the implementation. Go ahead and start coding your solution." action: "ACCEPT_APPROACH", approachStatus: "approved", nextPhase: "CODING".
- If NEEDS REVISION: point out the gap. action: "REJECT_APPROACH", approachStatus: "needs_revision", nextPhase: "APPROACH_DISCUSSION".`;

    case "CODING":
      return `PHASE: CODING
- Candidate is coding. If code submitted: "I can see your implementation. Let's trace through it with our test cases." action: "RUN_TESTS", nextPhase: "TESTING".
- If asking questions, guide concisely without writing code. action: "FOLLOW_UP", nextPhase: "CODING".`;

    case "TESTING":
      return `PHASE: TESTING
- If tests FAILED: point to failure, ask to trace where bug occurs. action: "REQUEST_DEBUGGING", nextPhase: "DEBUGGING".
- If tests PASSED: acknowledge pass, ask for final time and space complexity. action: "MOVE_TO_COMPLEXITY", nextPhase: "COMPLEXITY".`;

    case "DEBUGGING":
      return `PHASE: DEBUGGING
- Help candidate investigate failing cases. If fix submitted: action: "RUN_TESTS", nextPhase: "TESTING".`;

    case "COMPLEXITY":
      return `PHASE: COMPLEXITY
- Candidate analyzes time/space complexity. If justified: action: "EVALUATE", nextPhase: "FINAL_EVALUATION".
- If incomplete: ask for breakdown. action: "CHALLENGE", nextPhase: "COMPLEXITY".`;

    case "FINAL_EVALUATION":
      return `PHASE: FINAL_EVALUATION
- Conclude interview professionally with brief evaluation. action: "END", nextPhase: "END".`;

    default:
      return `PHASE: GENERAL
- Ask one relevant technical interviewer question.`;
  }
}

// ===================================
// Master Prompt Builder
// ===================================

function formatTestResults(testResults) {
  if (!testResults || !Array.isArray(testResults) || testResults.length === 0) return "";
  const total = testResults.length;
  const passed = testResults.filter((t) => t.passed).length;
  const failures = testResults
    .filter((t) => !t.passed)
    .map((t, idx) => {
      if (t.isHidden) {
        return `Failure #${idx + 1}: [Hidden Test Case Failed] (Do NOT leak internal test inputs to candidate; ask them to consider edge cases and constraints)`;
      }
      return `Failure #${idx + 1}: Input: ${t.input || "N/A"} | Expected: ${t.expectedOutput || "N/A"} | Actual: ${t.actualOutput || t.error || "N/A"}`;
    });

  return `\nEXECUTION / TEST RESULTS:
Status: ${passed === total ? "All Passed" : "Failures Detected"} (${passed}/${total} passed)
${failures.length > 0 ? `Failures:\n${failures.join("\n")}` : "All tests passed successfully."}\n`;
}

function buildInterviewPrompt(state) {
  const currentPhase = state.currentPhase || "START";
  const problemContext = formatProblemContext(state.problem);
  const conversationContext = formatConversationHistory(state.conversationHistory);
  const phaseDirectives = getPhaseDirectives(currentPhase, state);
  const testResultsContext = formatTestResults(state.testResults);

  return `${BASE_SYSTEM_PROMPT}

CURRENT STATE:
Phase: ${currentPhase} | Approach Status: ${state.approachStatus || "none"} | Hint Level: ${state.hintLevel || 0}
Candidate Message: "${state.candidateMessage || ""}"
${state.candidateCode ? `Submitted Code:\n${state.candidateCode}` : ""}
${testResultsContext}
${problemContext}

RECENT CHAT:
${conversationContext}

${phaseDirectives}

${JSON_SCHEMA_INSTRUCTION}
`;
}

module.exports = {
  BASE_SYSTEM_PROMPT,
  JSON_SCHEMA_INSTRUCTION,
  formatProblemContext,
  formatConversationHistory,
  formatTestResults,
  getPhaseDirectives,
  buildInterviewPrompt,
};
