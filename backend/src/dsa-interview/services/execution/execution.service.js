// ===================================
// DSA Execution Service
// ===================================
const DSAExecution = require("../../models/dsaExecution.model");
const { DSAInterview } = require("../../models/dsaInterview.model");
const DSAProblem = require("../../models/dsaProblem.model");
const Judge0Provider = require("./judge0.provider");
const { buildHarness } = require("./harness/harnessBuilder");
const { normalizeSingleTest, normalizeOverallResult } = require("./resultNormalizer");
const { EXECUTION_STATUS } = require("./execution.constants");
const { canTransition, transitionTo } = require("../stateMachine");

class ExecutionService {
  constructor(provider = null) {
    this.provider = provider || new Judge0Provider();
  }

  /**
   * Set custom execution provider (useful for testing or switching sandboxes)
   */
  setProvider(customProvider) {
    this.provider = customProvider;
  }

  /**
   * Create and trigger an execution request.
   */
  async createExecution({
    interviewId,
    userId,
    problemId,
    executionMode = "run",
    programmingLanguage = "javascript",
    candidateCode,
  }) {
    // Create execution record in database
    const execution = await DSAExecution.create({
      interviewId,
      userId,
      problemId,
      executionMode,
      programmingLanguage,
      candidateCode,
      status: EXECUTION_STATUS.RUNNING,
      requestedAt: new Date(),
    });

    // Update interview session with pending status
    await DSAInterview.findByIdAndUpdate(interviewId, {
      candidateCode,
      programmingLanguage,
      executionStatus: "pending",
      lastExecutionRequest: {
        executionId: execution._id.toString(),
        executionMode,
        programmingLanguage,
        requestedAt: new Date().toISOString(),
      },
    });

    // Run execution (handles visible vs hidden, normalizes, updates session & state machine)
    const executionPromise = this.runExecution(execution._id);

    return {
      executionId: execution._id.toString(),
      status: EXECUTION_STATUS.RUNNING,
      executionMode,
      programmingLanguage,
      promise: executionPromise,
    };
  }

  /**
   * Run the test suite against the execution provider and normalize results.
   */
  async runExecution(executionId) {
    const execution = await DSAExecution.findById(executionId);
    if (!execution) return null;

    try {
      const interview = await DSAInterview.findById(execution.interviewId);
      const problem = await DSAProblem.findById(execution.problemId);

      if (!interview || !problem) {
        throw new Error("Interview or problem not found for execution");
      }

      // Determine test cases to run
      // run mode: visible test cases only
      // submit mode: visible + hidden test cases
      const testCases = [];

      (problem.visibleTestCases || []).forEach((tc, idx) => {
        testCases.push({
          input: tc.input,
          output: tc.output,
          explanation: tc.explanation,
          isHidden: false,
        });
      });

      if (execution.executionMode === "submit") {
        (problem.hiddenTestCases || []).forEach((tc, idx) => {
          testCases.push({
            input: tc.input,
            output: tc.output,
            explanation: tc.explanation,
            isHidden: true,
          });
        });
      }

      // Fallback if problem had no test cases defined
      if (testCases.length === 0) {
        testCases.push({
          input: "",
          output: "",
          explanation: "",
          isHidden: false,
        });
      }

      // Prepare harness source code
      const wrappedSource = buildHarness(
        execution.programmingLanguage,
        execution.candidateCode,
        problem
      );

      const normalizedTestResults = [];

      // Execute each test case sequentially
      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const rawResult = await this.provider.execute({
          sourceCode: wrappedSource,
          language: execution.programmingLanguage,
          stdin: tc.input,
        });

        const singleNormalized = normalizeSingleTest(
          rawResult,
          tc,
          i + 1,
          execution.executionMode === "submit" // Mask hidden test details in submit mode
        );

        normalizedTestResults.push(singleNormalized);

        // If compilation error, stop further tests early
        if (singleNormalized.status === EXECUTION_STATUS.COMPILE_ERROR) {
          break;
        }
      }

      // Overall normalized result
      const overallResult = normalizeOverallResult(normalizedTestResults, {
        executionId: execution._id.toString(),
        executionMode: execution.executionMode,
        programmingLanguage: execution.programmingLanguage,
      });

      // Update execution record
      execution.status = overallResult.status;
      execution.result = overallResult;
      execution.completedAt = new Date();
      await execution.save();

      // Apply to interview session
      await this.applyExecutionToInterview(interview, execution, overallResult);

      return overallResult;
    } catch (err) {
      console.error("Execution error:", err);
      execution.status = EXECUTION_STATUS.SYSTEM_ERROR;
      execution.result = {
        status: EXECUTION_STATUS.SYSTEM_ERROR,
        error: err.message,
        testResults: [],
      };
      execution.completedAt = new Date();
      await execution.save();
      return execution.result;
    }
  }

  /**
   * Applies execution result to the interview and advances the state machine if SUBMIT.
   */
  async applyExecutionToInterview(interview, execution, overallResult) {
    const updateData = {
      executionStatus: overallResult.status,
      lastExecutionId: execution._id,
      lastExecutionAt: new Date(),
      candidateCode: execution.candidateCode,
      programmingLanguage: execution.programmingLanguage,
      testResults: (overallResult.testResults || []).map((t) => ({
        input: t.input,
        expectedOutput: t.expectedOutput,
        actualOutput: t.actualOutput,
        passed: t.passed,
        status: t.status,
        error: t.error,
      })),
      testsPassed: overallResult.status === EXECUTION_STATUS.PASSED,
    };

    // RUN MODE: Stays in CODING phase (development mode)
    if (execution.executionMode === "run") {
      await DSAInterview.findByIdAndUpdate(interview._id, updateData);
      return;
    }

    // SUBMIT MODE: Integrates with Phase 1 State Machine
    // Current phase must be CODING or DEBUGGING
    const currentPhase = interview.currentPhase;
    let targetTestingPhase = "TESTING";

    // Validate transition into TESTING
    if (canTransition(currentPhase, "TESTING", interview).allowed) {
      interview.currentPhase = transitionTo(currentPhase, "TESTING", interview);
    }

    // Now evaluate TESTING phase result
    const allPassed = overallResult.status === EXECUTION_STATUS.PASSED;
    let nextPhase = allPassed ? "COMPLEXITY" : "DEBUGGING";
    let interviewerMsgContent = "";

    // Validate transition from TESTING to COMPLEXITY or DEBUGGING
    if (canTransition("TESTING", nextPhase, { ...interview.toObject(), testResults: updateData.testResults, testsPassed: allPassed }).allowed) {
      interview.currentPhase = transitionTo("TESTING", nextPhase, {
        ...interview.toObject(),
        testResults: updateData.testResults,
        testsPassed: allPassed,
      });

      if (allPassed) {
        interviewerMsgContent =
          "Excellent! All test cases have passed. Let's discuss the algorithmic complexity of your solution. What is the time complexity and auxiliary space complexity?";
        interview.lastAction = "MOVE_TO_COMPLEXITY";
      } else {
        const failureCount = overallResult.testResults.filter((t) => !t.passed).length;
        interviewerMsgContent =
          `Your solution failed ${failureCount} test case(s). Let's debug this together. Take a look at the failing case and let's examine why the output differed from what was expected. What might be causing this behavior?`;
        interview.lastAction = "REQUEST_DEBUGGING";
        interview.debuggingAttempts = (interview.debuggingAttempts || 0) + 1;
      }

      // Append interviewer message to conversation history
      interview.conversationHistory.push({
        role: "interviewer",
        content: interviewerMsgContent,
        phase: interview.currentPhase,
        timestamp: new Date(),
      });
    }

    // Persist all updates to interview document
    Object.assign(interview, updateData);
    await interview.save();
  }

  /**
   * Retrieve execution record and verify authorization.
   */
  async getExecutionStatus(executionId, userId) {
    const execution = await DSAExecution.findById(executionId);
    if (!execution) return null;

    if (execution.userId.toString() !== userId.toString()) {
      const err = new Error("Unauthorized to access this execution record");
      err.statusCode = 403;
      throw err;
    }

    return execution;
  }
}

// Singleton instance
const executionService = new ExecutionService();

module.exports = {
  ExecutionService,
  executionService,
};
