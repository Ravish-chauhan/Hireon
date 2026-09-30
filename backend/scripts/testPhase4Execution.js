require("dotenv").config();
const assert = require("assert");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const { DSAInterview } = require("../src/dsa-interview/models/dsaInterview.model");
const DSAProblem = require("../src/dsa-interview/models/dsaProblem.model");
const DSAExecutionRaw = require("../src/dsa-interview/models/dsaExecution.model");
const DSAExecution = DSAExecutionRaw.DSAExecution || DSAExecutionRaw;
const interviewService = require("../src/dsa-interview/services/dsaInterview.service");
const { executionService } = require("../src/dsa-interview/services/execution/execution.service");
const { EXECUTION_STATUS } = require("../src/dsa-interview/services/execution/execution.constants");
const {
  requestExecution,
  getExecutionStatus,
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
    process.stdout.write(`  ⏳ RUNNING: ${name}... `);
    const start = Date.now();
    await fn();
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\r  ✅ PASS: ${name} (${duration}s)`);
    return true;
  } catch (err) {
    console.log(`\r  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    if (err.stack) console.error(err.stack);
    return false;
  }
}

async function runTestSuite() {
  console.log("=================================================");
  console.log(" Running Phase 4 Secure DSA Code Execution Engine Tests");
  console.log("=================================================\n");

  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/eduniaa";
  await mongoose.connect(mongoUri);

  let passed = 0;
  let total = 0;

  // Find or create test problem with visible and hidden test cases
  let problem = await DSAProblem.findOne({ slug: "two-sum" });
  if (!problem) {
    problem = await DSAProblem.create({
      title: "Two Sum Test",
      slug: "two-sum",
      difficulty: "easy",
      description: "Given nums and target, return indices of two numbers that add up to target.",
      visibleTestCases: [
        {
          input: "[2,7,11,15]\n9",
          output: "[0,1]",
          explanation: "nums[0] + nums[1] == 9, so return [0, 1].",
        },
        {
          input: "[3,2,4]\n6",
          output: "[1,2]",
          explanation: "nums[1] + nums[2] == 6, so return [1, 2].",
        },
      ],
      hiddenTestCases: [
        {
          input: "[3,3]\n6",
          output: "[0,1]",
          explanation: "Hidden test case with duplicates.",
        },
      ],
    });
  } else {
    // Ensure hidden test cases are present
    if (!problem.hiddenTestCases || problem.hiddenTestCases.length === 0) {
      problem.hiddenTestCases = [
        {
          input: "[3,3]\n6",
          output: "[0,1]",
          explanation: "Hidden test case with duplicates.",
        },
      ];
      await problem.save();
    }
  }

  const userA = new mongoose.Types.ObjectId("111111111111111111111111");
  const userB = new mongoose.Types.ObjectId("222222222222222222222222");

  // Create active session in CODING phase for testing
  let session = await interviewService.createSession({
    userId: userA,
    problemId: problem._id,
    programmingLanguage: "javascript",
  });
  session.currentPhase = "CODING";
  session.approachStatus = "approved";
  await session.save();

  // ----------------------------------------------------------------
  // Test 1: Multi-language Execution - JavaScript
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 1: JavaScript Execution (Correct Solution)", async () => {
      const jsCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "javascript",
        candidateCode: jsCode,
        executionMode: "run",
      });

      // Poll until execution completes
      let result = null;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 600));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result, "Execution should complete within timeout");
      assert.strictEqual(result.status, EXECUTION_STATUS.PASSED, "Status should be passed");
      assert.strictEqual(result.testsPassed, 2, "Both visible test cases should pass");
      assert.strictEqual(result.testsTotal, 2, "Visible test count should be 2");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 2: Multi-language Execution - Python
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 2: Python Execution (Correct Solution)", async () => {
      const pythonCode = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "python",
        candidateCode: pythonCode,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 600));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result, "Python execution should complete");
      assert.strictEqual(result.status, EXECUTION_STATUS.PASSED);
      assert.strictEqual(result.testsPassed, 2);
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 3: Multi-language Execution - Java
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 3: Java Execution (Correct Solution)", async () => {
      const javaCode = `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "java",
        candidateCode: javaCode,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 800));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result, "Java execution should complete");
      assert.strictEqual(result.status, EXECUTION_STATUS.PASSED);
      assert.strictEqual(result.testsPassed, 2);
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 4: Multi-language Execution - C++
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 4: C++ Execution (Correct Solution)", async () => {
      const cppCode = `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < (int)nums.size(); i++) {
            int comp = target - nums[i];
            if (map.find(comp) != map.end()) {
                return {map[comp], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "cpp",
        candidateCode: cppCode,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 800));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result, "C++ execution should complete");
      assert.strictEqual(result.status, EXECUTION_STATUS.PASSED);
      assert.strictEqual(result.testsPassed, 2);
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 5: Wrong Answer Handling
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 5: Wrong Answer (Incorrect Logic)", async () => {
      const wrongCode = `def twoSum(nums, target):
    return [0, 0] # Incorrect output`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "python",
        candidateCode: wrongCode,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 600));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result);
      assert.strictEqual(result.status, EXECUTION_STATUS.FAILED);
      assert.strictEqual(result.testsPassed, 0);
      assert.strictEqual(result.testResults[0].passed, false);
      assert.ok(result.testResults[0].actualOutput);
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 6: Compile Error Handling
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 6: Compile Error Handling (C++ Syntax Error)", async () => {
      const invalidCpp = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        SYNTAX_ERROR_UNKNOWN_TOKEN;;;;
    }
};`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "cpp",
        candidateCode: invalidCpp,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 600));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result);
      assert.strictEqual(result.status, EXECUTION_STATUS.COMPILE_ERROR);
      assert.ok(result.compileError, "Should include sanitized compiler error message");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 7: Runtime Error Handling
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 7: Runtime Error Handling (Division by Zero in Python)", async () => {
      const errorPython = `def twoSum(nums, target):
    x = 1 / 0
    return []`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "python",
        candidateCode: errorPython,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 600));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result);
      assert.strictEqual(result.status, EXECUTION_STATUS.RUNTIME_ERROR);
      assert.ok(result.runtimeError, "Should capture runtime error");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 8: Time Limit Exceeded (Infinite Loop Protection)
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 8: Time Limit Exceeded (Infinite Loop)", async () => {
      const infiniteLoop = `def twoSum(nums, target):
    while True:
        pass
    return []`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "python",
        candidateCode: infiniteLoop,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 800));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result);
      assert.strictEqual(result.status, EXECUTION_STATUS.TIME_LIMIT_EXCEEDED);
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 9: Output Flood Protection
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 9: Output Limit Protection (Output Flood)", async () => {
      const outputFlood = `def twoSum(nums, target):
    for _ in range(50000):
        print("X" * 1000)
    return []`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "python",
        candidateCode: outputFlood,
        executionMode: "run",
      });

      let result = null;
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 800));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result);
      // Judge0 will either flag output_limit_exceeded, time_limit_exceeded, or cap the output
      const validLimitStatuses = [
        EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED,
        EXECUTION_STATUS.TIME_LIMIT_EXCEEDED,
        EXECUTION_STATUS.FAILED,
      ];
      assert.ok(
        validLimitStatuses.includes(result.status),
        `Status ${result.status} should be a handled limit status`
      );
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 10: Security Boundary & Zero Local Node Execution
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 10: Security Boundary - No Host Exec & No Secret Leak", async () => {
      // 1. Verify static code analysis on execution engine - no child_process, no eval
      const execDir = path.join(__dirname, "../src/dsa-interview/services/execution");
      const files = fs.readdirSync(execDir).filter((f) => f.endsWith(".js"));

      for (const file of files) {
        const content = fs.readFileSync(path.join(execDir, file), "utf8");
        assert.ok(!content.includes("child_process"), `File ${file} must not import child_process`);
        assert.ok(!content.includes("child_process.exec"), `File ${file} must not call child_process.exec`);
        assert.ok(!content.includes("child_process.spawn"), `File ${file} must not call child_process.spawn`);
        assert.ok(!content.includes("eval("), `File ${file} must not call eval`);
        assert.ok(!content.includes("new Function("), `File ${file} must not call new Function`);
      }

      // 2. Candidate code attempting to inspect environment secrets in sandbox
      const envSpyCode = `import os
def twoSum(nums, target):
    # Attempt to read HireOn backend environment secrets
    groq = os.environ.get("GROQ_API_KEY", "")
    mongo = os.environ.get("MONGO_URI", "")
    jwt = os.environ.get("JWT_SECRET", "")
    print(f"SECRETS_FOUND:{groq}_{mongo}_{jwt}")
    return [0, 1]`;

      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "python",
        candidateCode: envSpyCode,
        executionMode: "run",
      });

      let record = null;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 600));
        record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          break;
        }
      }

      assert.ok(record && record.result);
      const stdout = record.result.testResults?.[0]?.actualOutput || "";
      // Ensure backend secrets are NOT present
      if (process.env.GROQ_API_KEY) {
        assert.ok(!stdout.includes(process.env.GROQ_API_KEY), "Backend GROQ_API_KEY must not be exposed");
      }
      if (process.env.MONGO_URI) {
        assert.ok(!stdout.includes(process.env.MONGO_URI), "Backend MONGO_URI must not be exposed");
      }
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 11: Hidden Test Masking in Submit Mode
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 11: Hidden Test Masking (Submit Mode)", async () => {
      const jsCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "javascript",
        candidateCode: jsCode,
        executionMode: "submit", // SUBMIT MODE executes visible + hidden
      });

      let result = null;
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 800));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          result = record.result;
          break;
        }
      }

      assert.ok(result, "Submit execution should complete");
      const expectedTotalTests = (problem.visibleTestCases || []).length + (problem.hiddenTestCases || []).length;
      assert.strictEqual(result.testsTotal, expectedTotalTests, `Total tests should be ${expectedTotalTests}`);
      assert.strictEqual(result.testsPassed, expectedTotalTests, "All tests should pass");

      // Verify that hidden test case details are masked
      const hiddenResult = result.testResults.find((t) => t.isHidden);
      assert.ok(hiddenResult, "Hidden test result must exist in result array");
      assert.strictEqual(
        hiddenResult.input,
        "[Hidden Test Case]",
        "Hidden test input must be masked"
      );
      assert.strictEqual(
        hiddenResult.expectedOutput,
        "[Hidden]",
        "Hidden test expectedOutput must be masked"
      );
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 12: Authorization & Lifecycle Guard
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 12: Authorization & Lifecycle Validation", async () => {
      // 1. User B cannot access User A's execution record
      const exec = await DSAExecution.findOne({ interviewId: session._id });
      assert.ok(exec, "Execution record should exist");

      const reqB = {
        params: { id: session._id.toString(), executionId: exec._id.toString() },
        user: { _id: userB },
      };
      const resB = createMockRes();
      await getExecutionStatus(reqB, resB);
      assert.strictEqual(resB.statusCode, 403, "User B should be 403 Forbidden");

      // 2. Completed interview cannot execute code
      const completedSession = await interviewService.createSession({
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "javascript",
      });
      completedSession.status = "completed";
      completedSession.currentPhase = "END";
      await completedSession.save();

      const reqCompleted = {
        params: { id: completedSession._id.toString() },
        user: { _id: userA },
        body: { code: "function twoSum() {}", executionMode: "run" },
      };
      const resCompleted = createMockRes();
      await requestExecution(reqCompleted, resCompleted);
      assert.strictEqual(resCompleted.statusCode, 400, "Completed session should reject execution");
      assert.ok(
        resCompleted.data.message.includes("Cannot execute code") ||
        resCompleted.data.message.includes("completed"),
        "Message should indicate code execution is rejected for completed interview"
      );

      await DSAInterview.findByIdAndDelete(completedSession._id);
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 13: State Machine Integration (Submit Failure -> DEBUGGING)
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 13: State Machine Integration (Submit Failure -> DEBUGGING)", async () => {
      // Reset session to CODING
      await DSAInterview.findByIdAndUpdate(session._id, {
        currentPhase: "CODING",
        debuggingAttempts: 0,
      });

      const failingCode = `function twoSum(nums, target) {
  return [0, 0]; // Fails
}`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "javascript",
        candidateCode: failingCode,
        executionMode: "submit",
      });

      // Poll until completed
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 800));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          break;
        }
      }

      // Check updated session state in DB
      const updated = await DSAInterview.findById(session._id);
      assert.strictEqual(updated.currentPhase, "DEBUGGING", "Failing submit must transition to DEBUGGING");
      assert.strictEqual(updated.lastAction, "REQUEST_DEBUGGING", "lastAction should be REQUEST_DEBUGGING");
      assert.strictEqual(updated.testsPassed, false, "testsPassed should be false");
      assert.ok(updated.debuggingAttempts >= 1, "debuggingAttempts should increment to at least 1");

      // Verify AI interviewer prompt in conversationHistory contains debugging directive
      const lastMsg = updated.conversationHistory[updated.conversationHistory.length - 1];
      assert.strictEqual(lastMsg.role, "interviewer");
      assert.ok(lastMsg.content.includes("debug"), "Interviewer message should prompt for debugging");
    })
  ) {
    passed++;
  }

  // ----------------------------------------------------------------
  // Test 14: State Machine Integration (Submit Pass -> COMPLEXITY)
  // ----------------------------------------------------------------
  total++;
  if (
    await runTest("Test 14: State Machine Integration (Submit Pass -> COMPLEXITY)", async () => {
      // Transition from DEBUGGING with passing code
      const passingCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
      const exec = await executionService.createExecution({
        interviewId: session._id,
        userId: userA,
        problemId: problem._id,
        programmingLanguage: "javascript",
        candidateCode: passingCode,
        executionMode: "submit",
      });

      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 800));
        const record = await DSAExecution.findById(exec.executionId);
        if (record && record.status !== "queued" && record.status !== "running") {
          break;
        }
      }

      const updated = await DSAInterview.findById(session._id);
      assert.strictEqual(updated.currentPhase, "COMPLEXITY", "Passing submit must transition to COMPLEXITY");
      assert.strictEqual(updated.lastAction, "MOVE_TO_COMPLEXITY", "lastAction should be MOVE_TO_COMPLEXITY");
      assert.strictEqual(updated.testsPassed, true, "testsPassed should be true");

      const lastMsg = updated.conversationHistory[updated.conversationHistory.length - 1];
      assert.strictEqual(lastMsg.role, "interviewer");
      assert.ok(lastMsg.content.includes("complexity"), "Interviewer message should prompt for complexity");
    })
  ) {
    passed++;
  }

  // Cleanup test session and executions
  await DSAInterview.findByIdAndDelete(session._id);
  await DSAExecution.deleteMany({ interviewId: session._id });

  console.log("\n=================================================");
  console.log(` Results: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log("=================================================\n");

  await mongoose.disconnect();
  process.exit(passed === total ? 0 : 1);
}

runTestSuite().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
