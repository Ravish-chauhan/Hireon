// ===================================
// Execution Constants & Mappings
// ===================================

const EXECUTION_STATUS = {
  QUEUED: "queued",
  RUNNING: "running",
  PASSED: "passed",
  FAILED: "failed",
  COMPILE_ERROR: "compile_error",
  RUNTIME_ERROR: "runtime_error",
  TIME_LIMIT_EXCEEDED: "time_limit_exceeded",
  MEMORY_LIMIT_EXCEEDED: "memory_limit_exceeded",
  OUTPUT_LIMIT_EXCEEDED: "output_limit_exceeded",
  SYSTEM_ERROR: "system_error",
};

// Supported programming languages mapped to Judge0 language IDs
const JUDGE0_LANGUAGE_IDS = {
  javascript: 102, // Node.js 22.08.0
  python: 100,     // Python 3.12.5
  java: 91,        // Java JDK 17.0.6
  cpp: 105,        // C++ GCC 14.1.0
};

// Execution Limits (Enforced strictly on the sandbox provider)
const RESOURCE_LIMITS = {
  CPU_TIME_LIMIT: 3.0,     // 3.0 seconds max per test case
  WALL_TIME_LIMIT: 5.0,    // 5.0 seconds wall clock max
  MEMORY_LIMIT: 128000,    // 128 MB max memory
  MAX_OUTPUT_SIZE: 20480,  // 20 KB max stdout/stderr (Judge0 CE limit)
  NETWORK_ENABLED: false,  // Disables network inside sandbox
};

module.exports = {
  EXECUTION_STATUS,
  JUDGE0_LANGUAGE_IDS,
  RESOURCE_LIMITS,
};
