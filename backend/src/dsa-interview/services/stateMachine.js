// ===================================
// DSA Interview State Machine
// ===================================
// Single authoritative source for all valid DSA interview
// phase transitions and action/phase validation.
//
// This is the core of Phase 1. No other file should
// directly mutate currentPhase without going through
// this module's validation.

// ===================================
// Canonical Phase List
// ===================================

const DSA_PHASES = [
  "START",
  "INTRODUCTION",
  "PROBLEM_PRESENTATION",
  "UNDERSTANDING",
  "APPROACH_DISCUSSION",
  "APPROACH_REVIEW",
  "CODING",
  "TESTING",
  "DEBUGGING",
  "COMPLEXITY",
  "FINAL_EVALUATION",
  "END",
];

// ===================================
// Valid Transitions Map
// ===================================
// Each key is a phase, and the value is an array of
// phases it is allowed to transition to.

const TRANSITIONS = {
  START:                ["INTRODUCTION"],
  INTRODUCTION:         ["INTRODUCTION", "PROBLEM_PRESENTATION"],
  PROBLEM_PRESENTATION: ["PROBLEM_PRESENTATION", "UNDERSTANDING"],
  UNDERSTANDING:        ["UNDERSTANDING", "APPROACH_DISCUSSION"],
  APPROACH_DISCUSSION:  ["APPROACH_DISCUSSION", "APPROACH_REVIEW"],
  APPROACH_REVIEW:      ["APPROACH_DISCUSSION", "CODING"],
  CODING:               ["CODING", "TESTING"],
  TESTING:              ["DEBUGGING", "COMPLEXITY"],
  DEBUGGING:            ["DEBUGGING", "TESTING"],
  COMPLEXITY:           ["COMPLEXITY", "FINAL_EVALUATION"],
  FINAL_EVALUATION:     ["END"],
  END:                  [],
};

// ===================================
// Interviewer Actions
// ===================================
// Actions that the system can take or receive.

const DSA_ACTIONS = [
  "ASK",
  "FOLLOW_UP",
  "CLARIFY",
  "CHALLENGE",
  "GIVE_HINT",
  "ACCEPT_APPROACH",
  "REJECT_APPROACH",
  "OPEN_EDITOR",
  "RUN_TESTS",
  "REQUEST_DEBUGGING",
  "MOVE_TO_COMPLEXITY",
  "EVALUATE",
  "END",
];

// ===================================
// Action → Valid Phase Map
// ===================================
// Each action is only meaningful during certain phases.

const ACTION_PHASE_MAP = {
  ASK:                DSA_PHASES,
  FOLLOW_UP:          ["UNDERSTANDING", "APPROACH_DISCUSSION", "APPROACH_REVIEW", "CODING", "DEBUGGING", "COMPLEXITY"],
  CLARIFY:            ["UNDERSTANDING", "APPROACH_DISCUSSION"],
  CHALLENGE:          ["APPROACH_DISCUSSION", "APPROACH_REVIEW", "COMPLEXITY"],
  GIVE_HINT:          ["UNDERSTANDING", "APPROACH_DISCUSSION", "CODING", "DEBUGGING"],
  ACCEPT_APPROACH:    ["APPROACH_REVIEW"],
  REJECT_APPROACH:    ["APPROACH_REVIEW"],
  OPEN_EDITOR:        ["CODING"],
  RUN_TESTS:          ["TESTING"],
  REQUEST_DEBUGGING:  ["TESTING"],
  MOVE_TO_COMPLEXITY: ["TESTING"],
  EVALUATE:           ["FINAL_EVALUATION"],
  END:                ["FINAL_EVALUATION", "END"],
};

// ===================================
// Transition Guards
// ===================================
// Additional conditions that must be met for certain
// transitions beyond the basic adjacency check.

const TRANSITION_GUARDS = {
  // APPROACH_REVIEW → CODING requires approved approach
  "APPROACH_REVIEW->CODING": (state) => {
    if (state.approachStatus !== "approved") {
      return {
        allowed: false,
        reason: `Approach must be approved before coding. Current status: ${state.approachStatus || "none"}`,
      };
    }
    return { allowed: true };
  },

  // APPROACH_REVIEW → APPROACH_DISCUSSION requires needs_revision
  "APPROACH_REVIEW->APPROACH_DISCUSSION": (state) => {
    if (state.approachStatus !== "needs_revision") {
      return {
        allowed: false,
        reason: `Approach must be marked as needs_revision to return to discussion. Current status: ${state.approachStatus || "none"}`,
      };
    }
    return { allowed: true };
  },

  // TESTING → COMPLEXITY requires passing test results
  "TESTING->COMPLEXITY": (state) => {
    const results = state.testResults || [];
    if (results.length > 0) {
      const allPassed = results.every((t) => t.passed);
      if (!allPassed) {
        return { allowed: false, reason: "All tests must pass before moving to complexity analysis" };
      }
    } else if (state.testsPassed === false) {
      return { allowed: false, reason: "Tests failed, cannot move to complexity analysis" };
    }
    return { allowed: true };
  },

  // TESTING → DEBUGGING requires failing test results
  "TESTING->DEBUGGING": (state) => {
    const results = state.testResults || [];
    if (results.length > 0) {
      const hasFailed = results.some((t) => !t.passed);
      if (!hasFailed) {
        return { allowed: false, reason: "No failing tests to debug" };
      }
    } else if (state.testsPassed === true) {
      return { allowed: false, reason: "All tests passed, no failing tests to debug" };
    }
    return { allowed: true };
  },
};

// ===================================
// Core Functions
// ===================================

/**
 * Check if a phase is valid.
 */
function isValidPhase(phase) {
  return DSA_PHASES.includes(phase);
}

/**
 * Check if a transition from currentPhase to nextPhase is allowed.
 * Returns { allowed: boolean, reason?: string }
 */
function canTransition(currentPhase, nextPhase, state = {}) {
  // Validate phases
  if (!isValidPhase(currentPhase)) {
    return { allowed: false, reason: `Invalid current phase: ${currentPhase}` };
  }
  if (!isValidPhase(nextPhase)) {
    return { allowed: false, reason: `Invalid target phase: ${nextPhase}` };
  }

  // Check adjacency
  const validTargets = TRANSITIONS[currentPhase] || [];
  if (!validTargets.includes(nextPhase)) {
    return {
      allowed: false,
      reason: `Transition ${currentPhase} → ${nextPhase} is not allowed. Valid targets: [${validTargets.join(", ")}]`,
    };
  }

  // Check guards
  const guardKey = `${currentPhase}->${nextPhase}`;
  const guard = TRANSITION_GUARDS[guardKey];
  if (guard) {
    return guard(state);
  }

  return { allowed: true };
}

/**
 * Execute a validated transition. Returns the new phase or throws with code INVALID_TRANSITION.
 */
function transitionTo(currentPhase, nextPhase, state = {}) {
  const result = canTransition(currentPhase, nextPhase, state);
  if (!result.allowed) {
    const error = new Error(result.reason);
    error.code = "INVALID_TRANSITION";
    throw error;
  }
  return nextPhase;
}

/**
 * Get the list of phases the current phase can transition to.
 */
function getValidTransitions(currentPhase) {
  if (!isValidPhase(currentPhase)) {
    return [];
  }
  return TRANSITIONS[currentPhase] || [];
}

/**
 * Check if an action is valid for the given phase.
 */
function isValidAction(action, phase) {
  const validPhases = ACTION_PHASE_MAP[action];
  if (!validPhases) {
    return false;
  }
  return validPhases.includes(phase);
}

/**
 * Check if the interview is in a terminal state.
 */
function isTerminal(phase) {
  return phase === "END";
}

/**
 * Determine the next phase for the approach review based on status.
 * This is the key decision point for the approach loop.
 * Phase 2 will replace the decision logic with LLM evaluation,
 * but this function will remain the interface.
 */
function resolveApproachReview(state = {}) {
  // If explicitly set in state, respect it
  if (state.approachStatus === "approved") {
    return { approachStatus: "approved", nextPhase: "CODING" };
  }
  if (state.approachStatus === "needs_revision") {
    return { approachStatus: "needs_revision", nextPhase: "APPROACH_DISCUSSION" };
  }

  // Phase 1: deterministic mock
  // After 2+ candidate messages in approach discussion/review, approve.
  // Otherwise, request revision on first try.
  const history = state.conversationHistory || [];
  const approachMessages = history.filter(
    (m) =>
      (m.phase === "APPROACH_DISCUSSION" || m.phase === "APPROACH_REVIEW") &&
      m.role === "candidate"
  );

  const totalCount = approachMessages.length + (state.candidateMessage ? 1 : 0);

  if (totalCount >= 2) {
    return { approachStatus: "approved", nextPhase: "CODING" };
  }

  return { approachStatus: "needs_revision", nextPhase: "APPROACH_DISCUSSION" };
}

/**
 * Determine the next phase after testing based on results.
 * Phase 2 will replace this with real test execution.
 */
function resolveTestResults(state = {}) {
  const results = state.testResults || [];

  // If actual test results exist, evaluate them
  if (results.length > 0) {
    const allPassed = results.every((t) => t.passed);
    if (allPassed) {
      return { testsPassed: true, nextPhase: "COMPLEXITY" };
    }
    return { testsPassed: false, nextPhase: "DEBUGGING" };
  }

  // If explicit flag passed in state
  if (state.testsPassed === true) {
    return { testsPassed: true, nextPhase: "COMPLEXITY" };
  }
  if (state.testsPassed === false) {
    return { testsPassed: false, nextPhase: "DEBUGGING" };
  }

  // Phase 1 mock: first time through testing → debugging, second time (after debugging) → pass
  const debugAttempts = state.debuggingAttempts || 0;
  if (debugAttempts >= 1) {
    return { testsPassed: true, nextPhase: "COMPLEXITY" };
  }
  return { testsPassed: false, nextPhase: "DEBUGGING" };
}

module.exports = {
  DSA_PHASES,
  DSA_ACTIONS,
  TRANSITIONS,
  ACTION_PHASE_MAP,
  isValidPhase,
  canTransition,
  transitionTo,
  getValidTransitions,
  isValidAction,
  isTerminal,
  resolveApproachReview,
  resolveTestResults,
};
