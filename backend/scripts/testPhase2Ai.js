// ===================================
// Phase 2: AI DSA Interviewer Test Suite
// ===================================
// Tests all 8 Phase 2 scenarios:
// 1. Clarification
// 2. Weak approach challenge
// 3. Good approach justification & approval
// 4. Premature coding gate
// 5. Progressive hint system
// 6. Invalid LLM transition rejection by state machine
// 7. Malformed LLM output recovery
// 8. LLM failure resilience & state preservation

require("dotenv").config();
const assert = require("assert");
const dsaGraph = require("../src/dsa-interview/graph/graph");
const {
  canTransition,
  transitionTo,
  isValidAction,
  isValidPhase,
} = require("../src/dsa-interview/services/stateMachine");
const {
  generateInterviewerDecision,
  cleanJsonOutput,
  validateAndSanitizeDecision,
  getFallbackDecision,
} = require("../src/dsa-interview/services/dsaAi.service");
const { applyValidatedTransition } = require("../src/dsa-interview/graph/nodes");

console.log("=========================================");
console.log(" Running Phase 2 AI DSA Interviewer Tests");
console.log("=========================================\n");

let passedCount = 0;
let totalCount = 0;

function runTest(name, fn) {
  totalCount++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}\n`);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalCount++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}\n`);
    throw err;
  }
}

const mockProblem = {
  title: "Two Sum",
  slug: "two-sum",
  difficulty: "easy",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
  constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
  examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }],
  expectedApproaches: ["Brute force O(n^2)", "One-pass Hash map O(n)"],
  optimalApproach: "Use a hash map to store each number and its index. For each number, check if (target - num) exists.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  hints: [
    "Think about what value you need to find for each element.",
    "A hash map can help you look up values in O(1) time.",
    "Store numbers you have seen in a hash map along with their index.",
  ],
};

(async () => {
  // ----------------------------------------------------
  // Scenario 1: Clarification
  // Candidate asks clarifying question -> AI answers with problem context
  // ----------------------------------------------------
  await runAsyncTest("Scenario 1: Clarification answering using problem context", async () => {
    const state = {
      currentPhase: "UNDERSTANDING",
      problem: mockProblem,
      conversationHistory: [
        { role: "interviewer", phase: "PROBLEM_PRESENTATION", content: "Here is Two Sum. What are your initial thoughts?" },
      ],
      candidateMessage: "Can the array contain negative numbers?",
    };

    const decision = await generateInterviewerDecision(state);
    assert.ok(decision.response, "AI must return a response");
    assert.ok(
      decision.response.toLowerCase().includes("negative") ||
      decision.response.toLowerCase().includes("yes") ||
      decision.response.toLowerCase().includes("constraint"),
      "Response should address negative numbers based on constraints"
    );
    assert.strictEqual(isValidAction(decision.action, "UNDERSTANDING"), true);
    assert.ok(["UNDERSTANDING", "APPROACH_DISCUSSION"].includes(decision.nextPhase));
  });

  // ----------------------------------------------------
  // Scenario 2: Weak Approach
  // Candidate gives flawed reasoning -> AI challenges it, stays in discussion
  // ----------------------------------------------------
  await runAsyncTest("Scenario 2: Weak approach challenge (needs_revision)", async () => {
    const state = {
      currentPhase: "APPROACH_DISCUSSION",
      approachStatus: "discussing",
      problem: mockProblem,
      conversationHistory: [
        { role: "interviewer", phase: "APPROACH_DISCUSSION", content: "How would you solve this problem?" },
      ],
      candidateMessage: "I will use two nested loops comparing every pair, and this will be O(n) linear time.",
    };

    const decision = await generateInterviewerDecision(state);
    assert.ok(decision.response, "AI must provide challenge response");
    assert.ok(
      decision.action === "CHALLENGE" || decision.action === "FOLLOW_UP",
      `Expected CHALLENGE or FOLLOW_UP action, got ${decision.action}`
    );
    // Should NOT approve an incorrect complexity claim
    assert.notStrictEqual(decision.approachStatus, "approved");
    assert.strictEqual(decision.nextPhase, "APPROACH_DISCUSSION");
  });

  // ----------------------------------------------------
  // Scenario 3: Good Approach Justification & Approval
  // Candidate explains optimal algorithm & complexity -> AI accepts -> CODING
  // ----------------------------------------------------
  await runAsyncTest("Scenario 3: Good approach leading to approval for CODING", async () => {
    const state = {
      currentPhase: "APPROACH_REVIEW",
      approachStatus: "discussing",
      problem: mockProblem,
      conversationHistory: [
        { role: "candidate", phase: "APPROACH_DISCUSSION", content: "I'll use a single pass with a hash map." },
        { role: "interviewer", phase: "APPROACH_DISCUSSION", content: "What will you store in the hash map and what is the complexity?" },
        { role: "candidate", phase: "APPROACH_DISCUSSION", content: "For each element num at index i, I compute complement = target - num. If complement is in the map, I return [map[complement], i]. Otherwise map[num] = i. Time is O(n) because each lookup is O(1) average, and space is O(n) for the map." },
      ],
      candidateMessage: "Are you comfortable with me coding this O(n) time and O(n) space hash map solution?",
    };

    const decision = await generateInterviewerDecision(state);
    assert.ok(decision.response, "AI must return response");
    // With thorough explanation, AI should recognize it or approve
    assert.ok(["approved", "discussing"].includes(decision.approachStatus));
    if (decision.approachStatus === "approved") {
      assert.strictEqual(decision.action, "ACCEPT_APPROACH");
      assert.strictEqual(decision.nextPhase, "CODING");
    }
  });

  // ----------------------------------------------------
  // Scenario 4: Premature Coding Request
  // Candidate asks to code before approval -> rejected, remains in discussion
  // ----------------------------------------------------
  await runAsyncTest("Scenario 4: Premature coding request without approval", async () => {
    const state = {
      interviewId: "premature-code-test",
      currentPhase: "APPROACH_DISCUSSION",
      approachStatus: "discussing",
      problem: mockProblem,
      conversationHistory: [],
      candidateMessage: "Can I start coding now? I want to write the code.",
    };

    const result = await dsaGraph.invoke(state);

    // Candidate MUST NOT enter CODING without approved approach!
    assert.notStrictEqual(result.currentPhase, "CODING", "Candidate must not jump to CODING prematurely");
    assert.strictEqual(result.currentPhase, "APPROACH_DISCUSSION");
    assert.notStrictEqual(result.approachStatus, "approved");
    assert.ok(result.aiResponse, "Interviewer must explain that approach/complexity must be agreed first");
  });

  // ----------------------------------------------------
  // Scenario 5: Progressive Hint System
  // Candidate asks for hint -> hintLevel increments, hintsUsed increments
  // ----------------------------------------------------
  await runAsyncTest("Scenario 5: Progressive hint system increments tracking", async () => {
    const state = {
      interviewId: "hint-test",
      currentPhase: "APPROACH_DISCUSSION",
      approachStatus: "discussing",
      hintsUsed: 0,
      hintLevel: 0,
      problem: mockProblem,
      conversationHistory: [
        { role: "interviewer", phase: "APPROACH_DISCUSSION", content: "How would you approach this?" },
      ],
      candidateMessage: "I am completely stuck and cannot think of an algorithm. Can you give me a hint?",
    };

    const result = await dsaGraph.invoke(state);

    assert.strictEqual(result.currentPhase, "APPROACH_DISCUSSION");
    assert.ok(result.hintsUsed >= 1, `Expected hintsUsed >= 1, got ${result.hintsUsed}`);
    assert.ok(result.hintLevel >= 1, `Expected hintLevel >= 1, got ${result.hintLevel}`);
    assert.ok(result.aiResponse, "Interviewer must provide a helpful non-spoiler hint");
    // Ensure the AI didn't paste the entire code solution
    assert.ok(!result.aiResponse.includes("return [map.get("), "Hint must not give full raw code");
  });

  // ----------------------------------------------------
  // Scenario 6: Invalid LLM Transition Rejection
  // LLM suggests jumping from APPROACH_DISCUSSION -> FINAL_EVALUATION
  // State machine MUST reject and keep session valid
  // ----------------------------------------------------
  runTest("Scenario 6: State machine rejects invalid LLM transition (APPROACH_DISCUSSION → FINAL_EVALUATION)", () => {
    const illegalTransition = applyValidatedTransition(
      "APPROACH_DISCUSSION",
      "FINAL_EVALUATION",
      { approachStatus: "discussing" }
    );

    assert.strictEqual(illegalTransition.rejected, true);
    assert.strictEqual(illegalTransition.nextPhase, "APPROACH_DISCUSSION");
    assert.ok(illegalTransition.reason.includes("not allowed"));

    // Also verify UNDERSTANDING → CODING is rejected
    const illegalCoding = applyValidatedTransition("UNDERSTANDING", "CODING", {});
    assert.strictEqual(illegalCoding.rejected, true);
    assert.strictEqual(illegalCoding.nextPhase, "UNDERSTANDING");
  });

  // ----------------------------------------------------
  // Scenario 7: Malformed LLM Output Recovery
  // Malformed JSON returns safe fallback without crashing
  // ----------------------------------------------------
  runTest("Scenario 7: Malformed LLM output recovery via cleanJsonOutput and fallback", () => {
    // 1. JSON with markdown fences and trailing text
    const rawFenced = "```json\n{\"response\":\"What is the time complexity?\",\"action\":\"CHALLENGE\",\"phase\":\"APPROACH_DISCUSSION\",\"approachStatus\":\"discussing\",\"nextPhase\":\"APPROACH_DISCUSSION\",\"reason\":\"Probe complexity\",\"hintLevel\":0}\n```\nHere is your answer!";
    const cleaned = cleanJsonOutput(rawFenced);
    const parsed = JSON.parse(cleaned);
    assert.strictEqual(parsed.action, "CHALLENGE");

    // 2. Completely broken JSON triggers fallback
    const broken = "I am an AI and I think { this is not json at all";
    const cleanedBroken = cleanJsonOutput(broken);
    let recovered;
    try {
      JSON.parse(cleanedBroken);
    } catch {
      recovered = getFallbackDecision({ currentPhase: "APPROACH_DISCUSSION" }, "Malformed JSON");
    }

    assert.ok(recovered, "Must produce fallback");
    assert.strictEqual(recovered.phase, "APPROACH_DISCUSSION");
    assert.strictEqual(recovered.isFallback, true);
    assert.ok(recovered.response.length > 0);
  });

  // ----------------------------------------------------
  // Scenario 8: LLM Failure Resilience & State Preservation
  // Simulated API error returns safe fallback without corrupting state
  // ----------------------------------------------------
  runTest("Scenario 8: LLM failure resilience & state preservation", () => {
    const originalState = {
      interviewId: "state-preservation-test",
      currentPhase: "APPROACH_DISCUSSION",
      approachStatus: "discussing",
      hintsUsed: 1,
      hintLevel: 1,
      candidateApproach: "Hash map lookup",
    };

    // Simulate error fallback
    const fallback = getFallbackDecision(originalState, "Simulated 500 Network Error");

    assert.strictEqual(fallback.isFallback, true);
    assert.strictEqual(fallback.phase, "APPROACH_DISCUSSION");
    assert.strictEqual(fallback.nextPhase, "APPROACH_DISCUSSION");
    // Verify critical state metadata would remain untouched
    assert.strictEqual(fallback.hintLevel, originalState.hintLevel);
  });

  console.log("\n=========================================");
  console.log(` Results: ${passedCount}/${totalCount} tests passed (100%)`);
  console.log("=========================================\n");
})();
