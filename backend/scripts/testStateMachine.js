// ===================================
// DSA Interview State Machine Tests
// ===================================
// Tests all 7 required Phase 1 scenarios and LangGraph orchestration.
// Uses node:assert — zero external dependencies.

const assert = require("assert");
const {
  DSA_PHASES,
  DSA_ACTIONS,
  TRANSITIONS,
  canTransition,
  transitionTo,
  isValidPhase,
  isValidAction,
  isTerminal,
  resolveApproachReview,
  resolveTestResults,
} = require("../src/dsa-interview/services/stateMachine");
const dsaGraph = require("../src/dsa-interview/graph/graph");

console.log("=========================================");
console.log(" Running DSA State Machine Test Suite");
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

(async () => {
  // ----------------------------------------------------
  // Test 1: Normal Flow
  // START → INTRODUCTION → PROBLEM_PRESENTATION → UNDERSTANDING
  // → APPROACH_DISCUSSION → APPROACH_REVIEW → CODING
  // ----------------------------------------------------
  runTest("Test 1: Normal flow (START to CODING)", () => {
    let phase = "START";
    phase = transitionTo(phase, "INTRODUCTION");
    assert.strictEqual(phase, "INTRODUCTION");

    phase = transitionTo(phase, "PROBLEM_PRESENTATION");
    assert.strictEqual(phase, "PROBLEM_PRESENTATION");

    phase = transitionTo(phase, "UNDERSTANDING");
    assert.strictEqual(phase, "UNDERSTANDING");

    phase = transitionTo(phase, "APPROACH_DISCUSSION");
    assert.strictEqual(phase, "APPROACH_DISCUSSION");

    phase = transitionTo(phase, "APPROACH_REVIEW");
    assert.strictEqual(phase, "APPROACH_REVIEW");

    // Approved approach can transition to CODING
    phase = transitionTo(phase, "CODING", { approachStatus: "approved" });
    assert.strictEqual(phase, "CODING");
  });

  // ----------------------------------------------------
  // Test 2: Approach Revision Loop
  // APPROACH_DISCUSSION → APPROACH_REVIEW → needs_revision
  // → APPROACH_DISCUSSION → APPROACH_REVIEW → approved → CODING
  // ----------------------------------------------------
  runTest("Test 2: Approach revision loop", () => {
    let phase = "APPROACH_DISCUSSION";
    phase = transitionTo(phase, "APPROACH_REVIEW");
    assert.strictEqual(phase, "APPROACH_REVIEW");

    // First attempt: resolve mock returns needs_revision
    const decision1 = resolveApproachReview({
      conversationHistory: [],
      candidateMessage: "First try approach",
    });
    assert.strictEqual(decision1.approachStatus, "needs_revision");
    assert.strictEqual(decision1.nextPhase, "APPROACH_DISCUSSION");

    // Loop back to discussion
    phase = transitionTo(phase, decision1.nextPhase, { approachStatus: decision1.approachStatus });
    assert.strictEqual(phase, "APPROACH_DISCUSSION");

    // Second discussion round -> moves to review
    phase = transitionTo(phase, "APPROACH_REVIEW");
    assert.strictEqual(phase, "APPROACH_REVIEW");

    // Second attempt: 2 messages now in history
    const decision2 = resolveApproachReview({
      conversationHistory: [
        { role: "candidate", phase: "APPROACH_DISCUSSION", content: "First try" },
        { role: "candidate", phase: "APPROACH_DISCUSSION", content: "Revised optimal hash map approach" },
      ],
    });
    assert.strictEqual(decision2.approachStatus, "approved");
    assert.strictEqual(decision2.nextPhase, "CODING");

    // Enters CODING with approved approach
    phase = transitionTo(phase, decision2.nextPhase, { approachStatus: decision2.approachStatus });
    assert.strictEqual(phase, "CODING");
  });

  // ----------------------------------------------------
  // Test 3: Testing Failure Loop
  // CODING → TESTING → failed → DEBUGGING → TESTING
  // ----------------------------------------------------
  runTest("Test 3: Testing failure and debugging loop", () => {
    let phase = "CODING";
    phase = transitionTo(phase, "TESTING");
    assert.strictEqual(phase, "TESTING");

    // Failed tests route to DEBUGGING
    const decisionFail = resolveTestResults({
      testResults: [
        { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", actualOutput: "[0,0]", passed: false },
      ],
    });
    assert.strictEqual(decisionFail.testsPassed, false);
    assert.strictEqual(decisionFail.nextPhase, "DEBUGGING");

    phase = transitionTo(phase, decisionFail.nextPhase, {
      testResults: [{ passed: false }],
    });
    assert.strictEqual(phase, "DEBUGGING");

    // Debugging loops back to TESTING
    phase = transitionTo(phase, "TESTING");
    assert.strictEqual(phase, "TESTING");
  });

  // ----------------------------------------------------
  // Test 4: Testing Success Flow
  // TESTING → passed → COMPLEXITY → FINAL_EVALUATION → END
  // ----------------------------------------------------
  runTest("Test 4: Testing success to END", () => {
    let phase = "TESTING";

    const decisionPass = resolveTestResults({
      testResults: [
        { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", actualOutput: "[0,1]", passed: true },
        { input: "[3,2,4], 6", expectedOutput: "[1,2]", actualOutput: "[1,2]", passed: true },
      ],
    });
    assert.strictEqual(decisionPass.testsPassed, true);
    assert.strictEqual(decisionPass.nextPhase, "COMPLEXITY");

    phase = transitionTo(phase, decisionPass.nextPhase, {
      testResults: [{ passed: true }],
    });
    assert.strictEqual(phase, "COMPLEXITY");

    phase = transitionTo(phase, "FINAL_EVALUATION");
    assert.strictEqual(phase, "FINAL_EVALUATION");

    phase = transitionTo(phase, "END");
    assert.strictEqual(phase, "END");
    assert.strictEqual(isTerminal(phase), true);
  });

  // ----------------------------------------------------
  // Test 5: Invalid Transition Rejection
  // UNDERSTANDING → CODING must be rejected
  // ----------------------------------------------------
  runTest("Test 5: Invalid transition rejection (UNDERSTANDING → CODING)", () => {
    const check = canTransition("UNDERSTANDING", "CODING");
    assert.strictEqual(check.allowed, false);
    assert.ok(check.reason.includes("not allowed"));

    assert.throws(
      () => transitionTo("UNDERSTANDING", "CODING"),
      (err) => {
        assert.strictEqual(err.code, "INVALID_TRANSITION");
        return true;
      }
    );

    // Also check other arbitrary illegal transitions
    assert.strictEqual(canTransition("APPROACH_DISCUSSION", "END").allowed, false);
    assert.strictEqual(canTransition("CODING", "FINAL_EVALUATION").allowed, false);
    assert.strictEqual(canTransition("TESTING", "END").allowed, false);
  });

  // ----------------------------------------------------
  // Test 6: Coding Gate Without Approved Approach
  // approachStatus !== approved cannot enter CODING
  // ----------------------------------------------------
  runTest("Test 6: Coding gate enforcement", () => {
    // With 'discussing' status
    const check1 = canTransition("APPROACH_REVIEW", "CODING", { approachStatus: "discussing" });
    assert.strictEqual(check1.allowed, false);
    assert.ok(check1.reason.includes("Approach must be approved"));

    // With 'needs_revision' status
    const check2 = canTransition("APPROACH_REVIEW", "CODING", { approachStatus: "needs_revision" });
    assert.strictEqual(check2.allowed, false);

    // With empty / undefined status
    const check3 = canTransition("APPROACH_REVIEW", "CODING", {});
    assert.strictEqual(check3.allowed, false);

    // Throws INVALID_TRANSITION when transitionTo is attempted without approved
    assert.throws(
      () => transitionTo("APPROACH_REVIEW", "CODING", { approachStatus: "needs_revision" }),
      (err) => {
        assert.strictEqual(err.code, "INVALID_TRANSITION");
        return true;
      }
    );

    // Allowed ONLY when approved
    const checkApproved = canTransition("APPROACH_REVIEW", "CODING", { approachStatus: "approved" });
    assert.strictEqual(checkApproved.allowed, true);
  });

  // ----------------------------------------------------
  // Test 7: Ended Interview Rejects Further Transitions
  // END is terminal, no targets allowed
  // ----------------------------------------------------
  runTest("Test 7: Terminal phase (END) behavior", () => {
    assert.strictEqual(isTerminal("END"), true);
    assert.deepStrictEqual(TRANSITIONS["END"], []);

    // Cannot transition anywhere from END
    for (const phase of DSA_PHASES) {
      const check = canTransition("END", phase);
      assert.strictEqual(check.allowed, false);
    }

    assert.throws(
      () => transitionTo("END", "INTRODUCTION"),
      (err) => {
        assert.strictEqual(err.code, "INVALID_TRANSITION");
        return true;
      }
    );
  });

  // ----------------------------------------------------
  // Test 8: Action Model Validation
  // ----------------------------------------------------
  runTest("Test 8: Action validation per phase", () => {
    // ACCEPT_APPROACH only valid in APPROACH_REVIEW
    assert.strictEqual(isValidAction("ACCEPT_APPROACH", "APPROACH_REVIEW"), true);
    assert.strictEqual(isValidAction("ACCEPT_APPROACH", "UNDERSTANDING"), false);
    assert.strictEqual(isValidAction("ACCEPT_APPROACH", "CODING"), false);

    // OPEN_EDITOR only valid in CODING
    assert.strictEqual(isValidAction("OPEN_EDITOR", "CODING"), true);
    assert.strictEqual(isValidAction("OPEN_EDITOR", "INTRODUCTION"), false);

    // RUN_TESTS valid in TESTING
    assert.strictEqual(isValidAction("RUN_TESTS", "TESTING"), true);
    assert.strictEqual(isValidAction("RUN_TESTS", "START"), false);

    // Unknown action rejected
    assert.strictEqual(isValidAction("UNKNOWN_ACTION", "CODING"), false);
  });

  // ----------------------------------------------------
  // Test 9: LangGraph Step Execution (Start → Introduction)
  // ----------------------------------------------------
  await runAsyncTest("Test 9: LangGraph invocation from START", async () => {
    const mockProblem = {
      title: "Two Sum",
      slug: "two-sum",
      description: "Find two indices that sum to target",
      constraints: ["2 <= nums.length <= 10^4"],
      examples: [{ input: "[2,7,11,15], 9", output: "[0,1]" }],
    };

    // Invoke start action
    const startResult = await dsaGraph.invoke({
      interviewId: "mock-id-1",
      userId: "user-1",
      action: "start",
      currentPhase: "START",
      problem: mockProblem,
      conversationHistory: [],
    });

    assert.strictEqual(startResult.currentPhase, "INTRODUCTION");
    assert.strictEqual(startResult.lastAction, "ASK");
    assert.ok(startResult.aiResponse.includes("Welcome to your DSA interview"));
    assert.strictEqual(startResult.conversationHistory.length, 1);

    // Next candidate message advances INTRODUCTION → PROBLEM_PRESENTATION
    const msgResult = await dsaGraph.invoke({
      interviewId: "mock-id-1",
      userId: "user-1",
      action: "message",
      currentPhase: startResult.currentPhase,
      problem: mockProblem,
      candidateMessage: "I am ready to begin",
      conversationHistory: startResult.conversationHistory,
    });

    assert.strictEqual(msgResult.currentPhase, "PROBLEM_PRESENTATION");
    assert.ok(msgResult.aiResponse.includes("Two Sum"));
    assert.strictEqual(msgResult.conversationHistory.length, 3); // greeting, candidate msg, problem msg
  });

  // ----------------------------------------------------
  // Test 10: Complete LangGraph End-to-End Orchestration
  // ----------------------------------------------------
  await runAsyncTest("Test 10: LangGraph full lifecycle (START to END)", async () => {
    const mockProblem = {
      title: "Two Sum",
      slug: "two-sum",
      description: "Find two indices",
      constraints: ["2 <= nums.length <= 10^4"],
      examples: [{ input: "[2,7,11,15], 9", output: "[0,1]" }],
    };

    let state = {
      interviewId: "lifecycle-test",
      userId: "user-lifecycle",
      action: "start",
      currentPhase: "START",
      problem: mockProblem,
      conversationHistory: [],
    };

    // 1. Start -> INTRODUCTION
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "INTRODUCTION");

    // 2. Candidate ready -> PROBLEM_PRESENTATION
    state = { ...state, action: "message", candidateMessage: "Ready" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "PROBLEM_PRESENTATION");

    // 3. Candidate asks question -> UNDERSTANDING
    state = { ...state, candidateMessage: "Can elements be negative?" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "UNDERSTANDING");

    // 4. Candidate discusses approach -> APPROACH_DISCUSSION
    state = { ...state, candidateMessage: "I can check all pairs" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "APPROACH_DISCUSSION");

    // 5. Candidate refines approach -> APPROACH_REVIEW
    state = { ...state, candidateMessage: "Actually a hash map is O(N)" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "APPROACH_REVIEW");

    // 6. Review approves (we pass approved) -> CODING
    state = { ...state, approachStatus: "approved", candidateMessage: "Confirming O(N) hash map" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "CODING");

    // 7. Candidate submits code -> TESTING
    state = { ...state, candidateCode: "function twoSum(nums, target) { ... }" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "TESTING");

    // 8. Testing passes -> COMPLEXITY
    state = { ...state, testsPassed: true, testResults: [{ passed: true }], candidateMessage: "Tests ran" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "COMPLEXITY");

    // 9. Candidate explains complexity -> FINAL_EVALUATION
    state = { ...state, timeComplexity: "O(n)", spaceComplexity: "O(n)", candidateMessage: "O(n) time and O(n) space" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "FINAL_EVALUATION");

    // 10. Evaluation completes -> END
    state = { ...state, candidateMessage: "Thank you" };
    state = { ...state, ...(await dsaGraph.invoke(state)) };
    assert.strictEqual(state.currentPhase, "END");
    assert.strictEqual(state.status, "completed");
    assert.ok(state.evaluation);
    assert.ok(state.evaluation.overallScore > 0);
  });

  console.log("\n=========================================");
  console.log(` Results: ${passedCount}/${totalCount} tests passed (100%)`);
  console.log("=========================================\n");
})();
