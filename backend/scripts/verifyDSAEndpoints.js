// ===================================
// DSA Endpoints & Persistence Verification
// ===================================
// Directly exercises problemService, interviewService, and LangGraph
// to verify MongoDB persistence and controller-level logic.

require("dotenv").config();
const mongoose = require("mongoose");
const assert = require("assert");

const problemService = require("../src/dsa-interview/services/dsaProblem.service");
const interviewService = require("../src/dsa-interview/services/dsaInterview.service");
const dsaGraph = require("../src/dsa-interview/graph/graph");
const { DSAInterview } = require("../src/dsa-interview/models/dsaInterview.model");
const {
  isValidAction,
  isValidPhase,
  isTerminal,
  canTransition,
} = require("../src/dsa-interview/services/stateMachine");

async function runVerification() {
  console.log("=========================================");
  console.log(" Verifying DSA DB & State Persistence");
  console.log("=========================================\n");

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  console.log(" Connected to MongoDB");

  const testUserId = new mongoose.Types.ObjectId();

  try {
    // 1. Verify problemService can fetch dummy problems
    console.log("\n1. Testing problemService.getRandomProblem...");
    const problem = await problemService.getRandomProblem({ difficulty: "easy" });
    assert.ok(problem, "Problem should exist");
    assert.ok(problem.title, "Problem must have title");
    console.log(`   Found problem: "${problem.title}" (${problem.difficulty})`);

    // 2. Testing createSession
    console.log("\n2. Testing interviewService.createSession...");
    const session = await interviewService.createSession({
      userId: testUserId,
      problemId: problem._id,
      programmingLanguage: "javascript",
    });
    assert.strictEqual(session.currentPhase, "START", "New session must start at START phase");
    assert.strictEqual(session.status, "in-progress");
    console.log(`   Created session: ${session._id} at phase: ${session.currentPhase}`);

    // 3. Simulating startDSAInterview graph invocation
    console.log("\n3. Testing START -> INTRODUCTION transition & persistence...");
    const startResult = await dsaGraph.invoke({
      interviewId: session._id.toString(),
      userId: testUserId.toString(),
      action: "start",
      currentPhase: session.currentPhase,
      problem: problem.toObject ? problem.toObject() : problem,
      conversationHistory: [],
    });

    assert.strictEqual(startResult.currentPhase, "INTRODUCTION");
    assert.strictEqual(startResult.lastAction, "ASK");

    // Persist update
    const updated1 = await interviewService.updateSession(session._id, {
      currentPhase: startResult.currentPhase,
      lastAction: startResult.lastAction,
      conversationHistory: startResult.conversationHistory,
    });

    // Check DB persistence directly
    const dbSession1 = await DSAInterview.findById(session._id);
    assert.strictEqual(dbSession1.currentPhase, "INTRODUCTION");
    assert.strictEqual(dbSession1.lastAction, "ASK");
    assert.strictEqual(dbSession1.conversationHistory.length, 1);
    console.log(`   MongoDB verified: Phase is ${dbSession1.currentPhase}, lastAction is ${dbSession1.lastAction}`);

    // 4. Simulating message 1 (Candidate ready -> PROBLEM_PRESENTATION)
    console.log("\n4. Testing candidate ready -> PROBLEM_PRESENTATION...");
    const msg1Result = await dsaGraph.invoke({
      interviewId: session._id.toString(),
      userId: testUserId.toString(),
      action: "message",
      currentPhase: dbSession1.currentPhase,
      problem: problem.toObject ? problem.toObject() : problem,
      conversationHistory: dbSession1.conversationHistory,
      candidateMessage: "I am ready to begin",
    });

    assert.strictEqual(msg1Result.currentPhase, "PROBLEM_PRESENTATION");
    await interviewService.updateSession(session._id, {
      currentPhase: msg1Result.currentPhase,
      lastAction: msg1Result.lastAction,
      conversationHistory: msg1Result.conversationHistory,
    });

    const dbSession2 = await DSAInterview.findById(session._id);
    assert.strictEqual(dbSession2.currentPhase, "PROBLEM_PRESENTATION");
    console.log(`   MongoDB verified: Phase is ${dbSession2.currentPhase}`);

    // 5. Simulating message 2 (Candidate asks question -> UNDERSTANDING)
    console.log("\n5. Testing candidate question -> UNDERSTANDING...");
    const msg2Result = await dsaGraph.invoke({
      interviewId: session._id.toString(),
      userId: testUserId.toString(),
      action: "message",
      currentPhase: dbSession2.currentPhase,
      problem: problem.toObject ? problem.toObject() : problem,
      conversationHistory: dbSession2.conversationHistory,
      candidateMessage: "Can the array have duplicate numbers?",
    });

    assert.strictEqual(msg2Result.currentPhase, "UNDERSTANDING");
    await interviewService.updateSession(session._id, {
      currentPhase: msg2Result.currentPhase,
      lastAction: msg2Result.lastAction,
      conversationHistory: msg2Result.conversationHistory,
    });

    const dbSession3 = await DSAInterview.findById(session._id);
    assert.strictEqual(dbSession3.currentPhase, "UNDERSTANDING");
    console.log(`   MongoDB verified: Phase is ${dbSession3.currentPhase}`);

    // 6. Action validation
    console.log("\n6. Verifying action validation in UNDERSTANDING phase...");
    assert.strictEqual(isValidAction("ASK", "UNDERSTANDING"), true);
    assert.strictEqual(isValidAction("CLARIFY", "UNDERSTANDING"), true);
    assert.strictEqual(isValidAction("ACCEPT_APPROACH", "UNDERSTANDING"), false);
    assert.strictEqual(isValidAction("RUN_TESTS", "UNDERSTANDING"), false);
    console.log("   Action validation verified for UNDERSTANDING phase");

    // 7. Cleanup test session
    await DSAInterview.findByIdAndDelete(session._id);
    console.log("\n Cleaned up test session");

    console.log("\n=========================================");
    console.log(" DB & State Persistence Verification: PASS");
    console.log("=========================================\n");
  } finally {
    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB");
  }
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
