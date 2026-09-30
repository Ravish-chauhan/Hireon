// ===================================
// DSA AI Interviewer Service
// ===================================
// Phase 2: Core AI Agent Orchestrator
// Coordinates prompt building, LLM invocation with rate-limit retry,
// response parsing, structured schema validation, and graceful error fallbacks.

const dsaLlm = require("../configs/llm");
const { buildInterviewPrompt } = require("../prompts/dsa.prompts");
const {
  DSA_PHASES,
  DSA_ACTIONS,
  isValidPhase,
  isValidAction,
} = require("./stateMachine");

// Default timeout for LLM calls (15 seconds)
const LLM_TIMEOUT_MS = 15000;

/**
 * Clean and extract JSON string from LLM output.
 */
function cleanJsonOutput(raw) {
  if (!raw || typeof raw !== "string") return "";

  let cleaned = raw.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  }

  // If there are still surrounding characters, extract the outermost JSON object
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Safe fallback decision when LLM fails or produces unrecoverable output.
 */
function getFallbackDecision(state, errorMessage = "LLM unavailable") {
  const currentPhase = state.currentPhase || "START";

  const fallbackResponses = {
    START: {
      response: "Welcome to your DSA interview! I'll present you with a problem, and we'll discuss your approach before writing code. Are you ready to begin?",
      action: "ASK",
      nextPhase: "INTRODUCTION",
      approachStatus: "",
    },
    INTRODUCTION: {
      response: "Take a moment to read through the problem statement and constraints. Do you have any initial questions?",
      action: "ASK",
      nextPhase: "PROBLEM_PRESENTATION",
      approachStatus: "",
    },
    PROBLEM_PRESENTATION: {
      response: "Let's clarify your understanding of the problem. Do you have any questions about constraints or expected inputs/outputs?",
      action: "ASK",
      nextPhase: "UNDERSTANDING",
      approachStatus: "",
    },
    UNDERSTANDING: {
      response: "Good. Now let's discuss your approach. How would you solve this problem? Walk me through your thinking.",
      action: "ASK",
      nextPhase: "APPROACH_DISCUSSION",
      approachStatus: "discussing",
    },
    APPROACH_DISCUSSION: {
      response: "Could you walk me through the time and space complexity of what you're proposing? Are there any edge cases you're considering?",
      action: "CHALLENGE",
      nextPhase: "APPROACH_DISCUSSION",
      approachStatus: "discussing",
    },
    APPROACH_REVIEW: {
      response: "Let's review your approach. Can you clarify how your algorithm handles the worst-case scenario before we code?",
      action: "REJECT_APPROACH",
      nextPhase: "APPROACH_DISCUSSION",
      approachStatus: "needs_revision",
    },
    CODING: {
      response: "Take your time implementing the solution. Let me know when you'd like to test it.",
      action: "FOLLOW_UP",
      nextPhase: "CODING",
      approachStatus: "approved",
    },
    TESTING: {
      response: "Let's trace through the test cases to verify the solution.",
      action: "RUN_TESTS",
      nextPhase: "TESTING",
      approachStatus: "approved",
    },
    DEBUGGING: {
      response: "Take a close look at the failing test case. Where might the logic be diverging from what's expected?",
      action: "REQUEST_DEBUGGING",
      nextPhase: "DEBUGGING",
      approachStatus: "approved",
    },
    COMPLEXITY: {
      response: "Could you break down the time and space complexity of your completed solution?",
      action: "CHALLENGE",
      nextPhase: "COMPLEXITY",
      approachStatus: "approved",
    },
    FINAL_EVALUATION: {
      response: "Thank you for completing this interview. Great effort working through the problem!",
      action: "END",
      nextPhase: "END",
      approachStatus: "approved",
    },
  };

  const template = fallbackResponses[currentPhase] || fallbackResponses.APPROACH_DISCUSSION;

  return {
    response: template.response,
    action: template.action,
    phase: currentPhase,
    approachStatus: template.approachStatus,
    nextPhase: template.nextPhase,
    reason: `Fallback applied: ${errorMessage}`,
    hintLevel: state.hintLevel || 0,
    isFallback: true,
  };
}

/**
 * Validate and sanitize structured decision object from the LLM.
 */
function validateAndSanitizeDecision(parsed, state) {
  const currentPhase = state.currentPhase || "START";

  // 1. Sanitize response
  let response = typeof parsed.response === "string" ? parsed.response.trim() : "";
  if (!response) {
    response = "Could you elaborate on your thought process?";
  }

  // 2. Validate action
  let action = parsed.action;
  if (!action || !isValidAction(action, currentPhase)) {
    action = currentPhase === "APPROACH_DISCUSSION" ? "FOLLOW_UP" : "ASK";
  }

  // 3. Validate approachStatus
  let approachStatus = parsed.approachStatus;
  const validStatuses = ["discussing", "needs_revision", "approved", ""];
  if (!validStatuses.includes(approachStatus)) {
    approachStatus = state.approachStatus || "";
  }

  // 4. Validate nextPhase
  let nextPhase = parsed.nextPhase;
  if (!nextPhase || !isValidPhase(nextPhase)) {
    nextPhase = currentPhase;
  }

  // 5. Hint level
  let hintLevel = typeof parsed.hintLevel === "number" ? parsed.hintLevel : state.hintLevel || 0;
  hintLevel = Math.max(0, Math.min(3, hintLevel));

  const reason = typeof parsed.reason === "string" ? parsed.reason.trim() : "Standard interview progression";

  return {
    response,
    action,
    phase: currentPhase,
    approachStatus,
    nextPhase,
    reason,
    hintLevel,
    isFallback: false,
  };
}

/**
 * Invokes LLM with retry & backoff on rate-limits (HTTP 429).
 */
async function callLlmWithRetry(prompt, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("LLM call timed out")), LLM_TIMEOUT_MS)
      );

      const llmPromise = dsaLlm.invoke(prompt);
      const rawResult = await Promise.race([llmPromise, timeoutPromise]);
      return rawResult;
    } catch (err) {
      const isRateLimit =
        err?.status === 429 ||
        (err?.message && err.message.includes("429")) ||
        (err?.message && err.message.includes("rate_limit"));

      if (isRateLimit && attempt < maxRetries) {
        console.warn(`[DSA AI Service] Rate limit hit. Backing off 2.5s (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, 2500));
        continue;
      }
      throw err;
    }
  }
}

/**
 * Call the Groq LLM with retry, timeout guard, and obtain a validated structured decision.
 */
async function generateInterviewerDecision(state) {
  const currentPhase = state.currentPhase || "START";

  try {
    const prompt = buildInterviewPrompt(state);
    const rawResult = await callLlmWithRetry(prompt);

    const content = rawResult?.content || "";
    const cleaned = cleanJsonOutput(content);

    if (!cleaned) {
      console.warn("[DSA AI Service] Empty content from LLM. Using fallback.");
      return getFallbackDecision(state, "Empty LLM content");
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.warn("[DSA AI Service] JSON parse failed on LLM response. Using fallback.", {
        raw: content.substring(0, 150),
        error: parseError.message,
      });
      return getFallbackDecision(state, "Malformed JSON from LLM");
    }

    return validateAndSanitizeDecision(parsed, state);
  } catch (error) {
    console.error("[DSA AI Service] LLM invocation error:", error.message);
    return getFallbackDecision(state, error.message);
  }
}

module.exports = {
  generateInterviewerDecision,
  cleanJsonOutput,
  validateAndSanitizeDecision,
  getFallbackDecision,
};
