require("dotenv").config();
const assert = require("assert");
const mongoose = require("mongoose");
const { DSAInterview } = require("../src/dsa-interview/models/dsaInterview.model");
const DSAProblem = require("../src/dsa-interview/models/dsaProblem.model");
const interviewService = require("../src/dsa-interview/services/dsaInterview.service");
const { transitionTo, canTransition } = require("../src/dsa-interview/services/stateMachine");
const {
  updateCandidateCode,
  requestExecution,
  getDSAInterview,
  SUPPORTED_LANGUAGES,
} = require("../src/dsa-interview/controllers/dsaInterview.controller");

// Helper mock response builder
function createMockRes() {
  return {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
  };
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    return true;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    if (err.stack) console.error(err.stack);
    return false;
  }
}

async function runTestSuite() {
  console.log("=========================================");
  console.log(" Running Phase 3 DSA Coding Environment Tests");
  console.log("=========================================\n");

  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/eduniaa";
  await mongoose.connect(mongoUri);

  let passed = 0;
  let total = 0;

  // Find or create test problem
  let problem = await DSAProblem.findOne({ slug: "two-sum" });
  if (!problem) {
    problem = await DSAProblem.create({
      title: "Two Sum Test",
      slug: "two-sum-test",
      difficulty: "easy",
      description: "Given nums and target...",
      starterCode: [
        { language: "javascript", code: "function twoSum(nums, target) {}" },
        { language: "python", code: "def twoSum(nums, target): pass" },
        { language: "java", code: "class Solution { public int[] twoSum() {} }" },
        { language: "cpp", code: "class Solution { public: vector<int> twoSum() {} };" },
      ],
    });
  }

  const userA = new mongoose.Types.ObjectId("111111111111111111111111");
  const userB = new mongoose.Types.ObjectId("222222222222222222222222");

  // Create active session for testing
  let session = await interviewService.createSession({
    userId: userA,
    problemId: problem._id,
    programmingLanguage: "javascript",
  });

  // ----------------------------------------------------------------
  // Test 1: Enter coding phase transition guard (APPROACH_REVIEW -> CODING)
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 1: Transition guard to CODING from APPROACH_REVIEW", async () => {
      // Direct jump from UNDERSTANDING to CODING must be blocked
      assert.throws(
        () => transitionTo("UNDERSTANDING", "CODING", {}),
        /Transition UNDERSTANDING → CODING is not allowed/
      );

      // Transition from APPROACH_REVIEW without approval must be blocked
      assert.throws(
        () => transitionTo("APPROACH_REVIEW", "CODING", { approachStatus: "discussing" }),
        /Approach must be approved before coding/
      );

      // Transition with approachStatus === 'approved' must succeed
      const allowed = transitionTo("APPROACH_REVIEW", "CODING", { approachStatus: "approved" });
      assert.strictEqual(allowed, "CODING");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 2: Starter code retrieval for all 4 supported languages
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 2: Starter code retrieval for Java, C++, Python, JavaScript", async () => {
      assert.deepStrictEqual(SUPPORTED_LANGUAGES, ["javascript", "python", "java", "cpp"]);

      for (const lang of SUPPORTED_LANGUAGES) {
        const found = problem.starterCode.find((s) => s.language === lang);
        assert.ok(found, `Starter code for ${lang} must exist on problem`);
        assert.ok(found.code.length > 5, `Starter code for ${lang} must be valid non-empty string`);
      }
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 3: Language selection and validation
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 3: Language validation rejects unsupported language", async () => {
      const req = {
        user: { _id: userA },
        params: { id: session._id.toString() },
        body: { programmingLanguage: "ruby", candidateCode: "puts 'hello'" },
      };
      const res = createMockRes();
      await updateCandidateCode(req, res);

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes("Unsupported programming language"));
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 4: Code persistence via PATCH /:id/code
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 4: Candidate code persistence and metadata updates", async () => {
      const testCode = "function twoSum(nums, target) { return [0, 1]; }";
      const req = {
        user: { _id: userA },
        params: { id: session._id.toString() },
        body: { programmingLanguage: "javascript", candidateCode: testCode },
      };
      const res = createMockRes();
      await updateCandidateCode(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.candidateCode, testCode);
      assert.strictEqual(res.data.programmingLanguage, "javascript");
      assert.strictEqual(res.data.executionStatus, "saved");
      assert.ok(res.data.lastCodeSavedAt);
      assert.ok(res.data.codeVersion >= 1);

      // Verify directly from MongoDB
      const stored = await DSAInterview.findById(session._id);
      assert.strictEqual(stored.candidateCode, testCode);
      assert.strictEqual(stored.executionStatus, "saved");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 5: Autosave does NOT trigger state transition
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 5: Autosave preserves current interview phase without state mutation", async () => {
      // Set session to CODING phase
      session.currentPhase = "CODING";
      await session.save();

      const req = {
        user: { _id: userA },
        params: { id: session._id.toString() },
        body: { candidateCode: "// autosaved draft edit" },
      };
      const res = createMockRes();
      await updateCandidateCode(req, res);

      assert.strictEqual(res.statusCode, 200);
      const stored = await DSAInterview.findById(session._id);
      assert.strictEqual(stored.currentPhase, "CODING");
      assert.strictEqual(stored.candidateCode, "// autosaved draft edit");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 6: Unauthorized update prevention (user B cannot update user A's interview)
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 6: Security - Unauthorized user cannot update another candidate's code", async () => {
      const req = {
        user: { _id: userB }, // User B attempting to mutate User A's session
        params: { id: session._id.toString() },
        body: { candidateCode: "malicious code injection" },
      };
      const res = createMockRes();
      await updateCandidateCode(req, res);

      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.data.success, false);

      // Verify code was NOT mutated
      const stored = await DSAInterview.findById(session._id);
      assert.notStrictEqual(stored.candidateCode, "malicious code injection");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 7: Run execution request created (execution_pending contract)
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 7: Run request creates execution_pending contract without local code execution", async () => {
      const req = {
        user: { _id: userA },
        params: { id: session._id.toString() },
        body: {
          executionMode: "run",
          programmingLanguage: "python",
          candidateCode: "def twoSum(nums, target):\n    return [0, 1]",
        },
      };
      const res = createMockRes();
      await requestExecution(req, res);

      assert.strictEqual(res.statusCode, 202);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.status, "execution_pending");
      assert.strictEqual(res.data.executionRequest.executionMode, "run");
      assert.strictEqual(res.data.executionRequest.programmingLanguage, "python");
      assert.ok(res.data.executionRequest.requestedAt);

      // Verify database stored execution contract
      const stored = await DSAInterview.findById(session._id);
      assert.strictEqual(stored.executionStatus, "pending");
      assert.ok(stored.lastExecutionRequest);
      assert.strictEqual(stored.lastExecutionRequest.executionMode, "run");
      assert.strictEqual(stored.lastExecutionRequest.programmingLanguage, "python");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 8: Submit execution request created (execution_pending contract)
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 8: Submit request creates execution_pending contract for full test suite", async () => {
      const req = {
        user: { _id: userA },
        params: { id: session._id.toString() },
        body: {
          executionMode: "submit",
          programmingLanguage: "java",
          candidateCode: "class Solution { public int[] twoSum() { return new int[]{0, 1}; } }",
        },
      };
      const res = createMockRes();
      await requestExecution(req, res);

      assert.strictEqual(res.statusCode, 202);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.status, "execution_pending");
      assert.strictEqual(res.data.executionRequest.executionMode, "submit");
      assert.strictEqual(res.data.executionRequest.programmingLanguage, "java");

      const stored = await DSAInterview.findById(session._id);
      assert.strictEqual(stored.lastExecutionRequest.executionMode, "submit");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 9: Session Recovery on GET /:id
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 9: Session recovery restores programmingLanguage, candidateCode, and problem", async () => {
      const req = {
        user: { _id: userA },
        params: { id: session._id.toString() },
      };
      const res = createMockRes();
      await getDSAInterview(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.interview.programmingLanguage, "java");
      assert.ok(res.data.interview.candidateCode.includes("class Solution"));
      assert.strictEqual(res.data.interview.currentPhase, "CODING");
      assert.ok(res.data.interview.problemId);
      assert.ok(res.data.interview.problemId.starterCode.length >= 4);
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 10: Security check - No unsafe execution mechanism used
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 10: Security - Ensure zero child_process or eval invocation", async () => {
      const fs = require("fs");
      const path = require("path");
      const controllerContent = fs.readFileSync(
        path.join(__dirname, "../src/dsa-interview/controllers/dsaInterview.controller.js"),
        "utf8"
      );

      assert.ok(!controllerContent.includes("child_process"), "Must not import child_process");
      assert.ok(!controllerContent.includes("exec("), "Must not call exec()");
      assert.ok(!controllerContent.includes("spawn("), "Must not call spawn()");
      assert.ok(!controllerContent.includes("eval("), "Must not call eval()");
      assert.ok(!controllerContent.includes("new Function("), "Must not call new Function()");
    })
  ) {
    passed++;
  }

  // Cleanup test session
  await DSAInterview.findByIdAndDelete(session._id);

  console.log("\n=========================================");
  console.log(` Results: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log("=========================================\n");

  await mongoose.disconnect();
  process.exit(passed === total ? 0 : 1);
}

runTestSuite().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
