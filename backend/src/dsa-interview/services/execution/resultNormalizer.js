// ===================================
// Result Normalizer
// ===================================
const { EXECUTION_STATUS, RESOURCE_LIMITS } = require("./execution.constants");

/**
 * Compare actual stdout with expected output flexibly.
 * Handles whitespace differences, bracket spacing, boolean casing, etc.
 */
function areOutputsEqual(actual, expected) {
  if (actual === undefined || actual === null) return false;
  if (expected === undefined || expected === null) return false;

  const a = String(actual).trim();
  const e = String(expected).trim();

  if (a === e) return true;

  // Normalize JSON / Arrays (e.g. "[0, 1]" vs "[0,1]")
  const aNorm = a.replace(/\s+/g, "").toLowerCase();
  const eNorm = e.replace(/\s+/g, "").toLowerCase();
  if (aNorm === eNorm) return true;

  // Normalize quotes (e.g. '"abc"' vs 'abc')
  const unquotedA = a.replace(/^["']|["']$/g, "");
  const unquotedE = e.replace(/^["']|["']$/g, "");
  if (unquotedA === unquotedE) return true;

  return false;
}

/**
 * Normalizes a single Judge0 test case execution output.
 *
 * @param {Object} raw - Judge0 raw response { status, stdout, stderr, compile_output, time, memory }
 * @param {Object} testCase - Test case definition { input, output, isHidden }
 * @param {number} testIndex - Index of test (1-indexed)
 * @param {boolean} maskHidden - Whether to redact input/output for hidden tests
 * @returns {Object} Normalized single test case result
 */
function normalizeSingleTest(raw, testCase, testIndex = 1, maskHidden = false) {
  const statusId = raw?.status?.id || 0;
  const isHidden = Boolean(testCase.isHidden);

  let passed = false;
  let status = EXECUTION_STATUS.FAILED;
  let error = null;

  const rawStdout = raw?.stdout || "";
  const rawStderr = raw?.stderr || "";
  const rawCompileOutput = raw?.compile_output || "";

  // Output limit check
  const maxLimit = RESOURCE_LIMITS?.MAX_OUTPUT_SIZE || 20480;
  const isOutputExceeded =
    statusId === 15 || // Judge0 Output Limit Exceeded
    rawStdout.length > maxLimit ||
    rawStderr.length > maxLimit;

  // Safe truncation for DB persistence & frontend display (max 4KB)
  const truncate = (str, limit = 4096) => {
    if (!str) return "";
    const trimmed = String(str).trim();
    if (trimmed.length <= limit) return trimmed;
    return trimmed.substring(0, limit) + "\n... [output truncated]";
  };

  const stdout = truncate(rawStdout);
  const stderr = truncate(rawStderr);
  const compileOutput = truncate(rawCompileOutput);
  const timeMs = raw?.time ? Math.round(parseFloat(raw.time) * 1000) : 0;
  const memoryKb = raw?.memory || 0;

  if (isOutputExceeded) {
    passed = false;
    status = EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED;
    error = `Output limit exceeded (maximum allowed size: ${maxLimit} bytes).`;
  } else {
    switch (statusId) {
      case 3: // Accepted by Judge0 (executed without crashing)
        passed = areOutputsEqual(stdout, testCase.output);
        status = passed ? EXECUTION_STATUS.PASSED : EXECUTION_STATUS.FAILED;
        break;

      case 4: // Wrong Answer
        passed = false;
        status = EXECUTION_STATUS.FAILED;
        break;

      case 5: // Time Limit Exceeded
        passed = false;
        status = EXECUTION_STATUS.TIME_LIMIT_EXCEEDED;
        error = "Time limit exceeded (potential infinite loop or slow algorithm).";
        break;

      case 6: // Compilation Error
        passed = false;
        status = EXECUTION_STATUS.COMPILE_ERROR;
        error = compileOutput || "Compilation failed.";
        break;

      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12: // Runtime Errors (NZEC, SIGSEGV, SIGFPE, etc.)
        passed = false;
        status = EXECUTION_STATUS.RUNTIME_ERROR;
        error = stderr || raw?.status?.description || "Runtime error occurred.";
        break;

      case 13:
      case 14:
        passed = false;
        status = EXECUTION_STATUS.SYSTEM_ERROR;
        error = "Execution environment error.";
        break;

      case 15:
        passed = false;
        status = EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED;
        error = "Output limit exceeded.";
        break;

      default:
        passed = false;
        status = EXECUTION_STATUS.FAILED;
        error = stderr || raw?.status?.description || "Execution failed.";
    }
  }

  return {
    testNumber: testIndex,
    passed,
    status,
    input: isHidden && maskHidden ? "[Hidden Test Case]" : testCase.input,
    expectedOutput: isHidden && maskHidden ? "[Hidden]" : testCase.output,
    actualOutput: isHidden && maskHidden ? (passed ? "[Passed]" : "[Failed Output Hidden]") : stdout,
    timeMs,
    memoryKb,
    error,
    isHidden,
  };
}

/**
 * Aggregates and normalizes multiple test results into the final contract.
 *
 * @param {Array<Object>} testResults - Array of normalized single test results
 * @param {Object} metadata - { executionId, executionMode, programmingLanguage }
 * @returns {Object} Final normalized execution result contract
 */
function normalizeOverallResult(testResults, metadata = {}) {
  const testsTotal = testResults.length;
  const testsPassed = testResults.filter((t) => t.passed).length;

  let compileError = null;
  let runtimeError = null;
  let overallStatus = EXECUTION_STATUS.PASSED;

  let totalTimeMs = 0;
  let maxMemoryKb = 0;

  for (const t of testResults) {
    totalTimeMs += t.timeMs || 0;
    if ((t.memoryKb || 0) > maxMemoryKb) maxMemoryKb = t.memoryKb;

    if (t.status === EXECUTION_STATUS.COMPILE_ERROR && !compileError) {
      compileError = t.error;
    }
    if (t.status === EXECUTION_STATUS.RUNTIME_ERROR && !runtimeError) {
      runtimeError = t.error;
    }
  }

  if (compileError) {
    overallStatus = EXECUTION_STATUS.COMPILE_ERROR;
  } else if (testResults.some((t) => t.status === EXECUTION_STATUS.TIME_LIMIT_EXCEEDED)) {
    overallStatus = EXECUTION_STATUS.TIME_LIMIT_EXCEEDED;
  } else if (testResults.some((t) => t.status === EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED)) {
    overallStatus = EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED;
  } else if (testResults.some((t) => t.status === EXECUTION_STATUS.SYSTEM_ERROR)) {
    overallStatus = EXECUTION_STATUS.SYSTEM_ERROR;
  } else if (runtimeError) {
    overallStatus = EXECUTION_STATUS.RUNTIME_ERROR;
  } else if (testsPassed === testsTotal && testsTotal > 0) {
    overallStatus = EXECUTION_STATUS.PASSED;
  } else {
    overallStatus = EXECUTION_STATUS.FAILED;
  }

  return {
    status: overallStatus,
    executionId: metadata.executionId || null,
    executionMode: metadata.executionMode || "run",
    programmingLanguage: metadata.programmingLanguage || "javascript",
    testsPassed,
    testsTotal,
    testResults,
    compileError,
    runtimeError,
    timeMs: totalTimeMs,
    memoryKb: maxMemoryKb,
  };
}

module.exports = {
  areOutputsEqual,
  normalizeSingleTest,
  normalizeOverallResult,
};
