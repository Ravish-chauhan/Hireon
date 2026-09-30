const dsaGraph = require("../graph/graph");
const problemService = require("../services/dsaProblem.service");
const interviewService = require("../services/dsaInterview.service");
const { executionService } = require("../services/execution/execution.service");
const {
  isValidAction,
  isValidPhase,
  isTerminal,
} = require("../services/stateMachine");

// Redis is optional — graceful fallback (same pattern as existing ai-interview)
let redis = null;
try {
  const Redis = require("ioredis");
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      lazyConnect: false,
      enableOfflineQueue: false,
    });
    redis.on("error", () => {
      redis = null;
    });
  }
} catch (err) {
  console.log("DSA Interview: Redis not available, caching disabled");
}

const safeRedis = {
  async get(key) {
    try {
      return redis ? await redis.get(key) : null;
    } catch {
      return null;
    }
  },
  async set(key, value, ...args) {
    try {
      if (redis) await redis.set(key, value, ...args);
    } catch {}
  },
  async del(key) {
    try {
      if (redis) await redis.del(key);
    } catch {}
  },
};

// ===================================
// Start DSA Interview
// ===================================

const startDSAInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { difficulty, topics, programmingLanguage, problemSlug } = req.body;

    // Get a problem (specific or random)
    let problem;
    if (problemSlug) {
      problem = await problemService.getProblemBySlug(problemSlug);
    } else {
      problem = await problemService.getRandomProblem({ difficulty, topics });
    }

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "No DSA problems found matching the criteria. Please seed the database first.",
      });
    }

    // Create interview session in START phase
    const session = await interviewService.createSession({
      userId,
      problemId: problem._id,
      programmingLanguage: programmingLanguage || "javascript",
    });

    // Run the graph for initial START → INTRODUCTION transition
    const result = await dsaGraph.invoke({
      interviewId: session._id.toString(),
      userId: userId.toString(),
      action: "start",
      currentPhase: "START",
      problem: problem.toObject ? problem.toObject() : problem,
      conversationHistory: [],
      candidateMessage: "",
      candidateApproach: "",
      approachStatus: "",
      hintsUsed: 0,
      hintLevel: 0,
      programmingLanguage: programmingLanguage || "javascript",
      candidateCode: "",
      testResults: [],
      debuggingAttempts: 0,
      timeComplexity: "",
      spaceComplexity: "",
      evaluation: null,
      aiResponse: "",
      status: "in-progress",
    });

    // Save the initial state with the validated transition
    await interviewService.updateSession(session._id, {
      currentPhase: result.currentPhase,
      lastAction: result.lastAction,
      conversationHistory: result.conversationHistory,
    });

    await safeRedis.del(`dsa-interviews:${userId}`);

    return res.status(201).json({
      success: true,
      interviewId: session._id,
      currentPhase: result.currentPhase,
      lastAction: result.lastAction,
      aiResponse: result.aiResponse,
      conversationHistory: result.conversationHistory,
      problem: {
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        topics: problem.topics,
      },
    });
  } catch (error) {
    console.log("startDSAInterview error:", error);
    if (error.code === "INVALID_TRANSITION") {
      return res.status(400).json({
        success: false,
        message: error.message,
        code: "INVALID_TRANSITION",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Get DSA Interview
// ===================================

const getDSAInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const session = await interviewService.getSession(id, userId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "DSA interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview: session,
    });
  } catch (error) {
    console.log("getDSAInterview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Send Message (Conversational Flow)
// ===================================

const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { message, code, action } = req.body;

    if (!message && !code) {
      return res.status(400).json({
        success: false,
        message: "Message or code is required",
      });
    }

    // Get current session
    const session = await interviewService.getSession(id, userId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "DSA interview not found",
      });
    }

    if (session.status === "completed" || session.currentPhase === "END" || isTerminal(session.currentPhase)) {
      return res.status(400).json({
        success: false,
        message: "Interview already completed",
      });
    }

    if (session.status === "abandoned") {
      return res.status(400).json({
        success: false,
        message: "Interview has been abandoned",
      });
    }

    // Validate phase integrity
    if (!isValidPhase(session.currentPhase)) {
      return res.status(400).json({
        success: false,
        message: `Interview is in an unknown phase: ${session.currentPhase}`,
      });
    }

    // Validate action if explicitly supplied
    if (action && !isValidAction(action, session.currentPhase)) {
      return res.status(400).json({
        success: false,
        message: `Action '${action}' is not valid for phase '${session.currentPhase}'`,
      });
    }

    // Get the problem data (populated by getSession)
    const problem = session.problemId;
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Associated DSA problem not found",
      });
    }

    // Run the graph with current state + new message
    const result = await dsaGraph.invoke({
      interviewId: session._id.toString(),
      userId: userId.toString(),
      action: action || "message",
      lastAction: session.lastAction || "",
      currentPhase: session.currentPhase,
      problem: problem.toObject ? problem.toObject() : problem,
      conversationHistory: session.conversationHistory || [],
      candidateMessage: message || "",
      candidateApproach: session.candidateApproach || "",
      approachStatus: session.approachStatus || "",
      hintsUsed: session.hintsUsed || 0,
      hintLevel: session.hintLevel || 0,
      programmingLanguage: session.programmingLanguage || "javascript",
      candidateCode: code || session.candidateCode || "",
      testResults: session.testResults || [],
      debuggingAttempts: session.debuggingAttempts || 0,
      timeComplexity: session.timeComplexity || "",
      spaceComplexity: session.spaceComplexity || "",
      evaluation: session.evaluation || null,
      aiResponse: "",
      status: session.status,
    });

    // Build update payload
    const updateData = {
      currentPhase: result.currentPhase,
      lastAction: result.lastAction || session.lastAction,
      conversationHistory: result.conversationHistory,
      candidateApproach: result.candidateApproach || session.candidateApproach,
      approachStatus: result.approachStatus || session.approachStatus,
      hintsUsed: result.hintsUsed ?? session.hintsUsed,
      hintLevel: result.hintLevel ?? session.hintLevel,
      candidateCode: result.candidateCode || session.candidateCode,
      testResults: result.testResults || session.testResults,
      debuggingAttempts: result.debuggingAttempts ?? session.debuggingAttempts,
      timeComplexity: result.timeComplexity || session.timeComplexity,
      spaceComplexity: result.spaceComplexity || session.spaceComplexity,
    };

    // If completed or END reached, mark completed
    if (result.status === "completed" || result.currentPhase === "END") {
      updateData.status = "completed";
      updateData.evaluation = result.evaluation;
      updateData.completedAt = new Date();
    }

    await interviewService.updateSession(session._id, updateData);
    await safeRedis.del(`dsa-interviews:${userId}`);

    return res.status(200).json({
      success: true,
      currentPhase: result.currentPhase,
      lastAction: result.lastAction,
      approachStatus: updateData.approachStatus || result.approachStatus,
      hintsUsed: updateData.hintsUsed ?? result.hintsUsed,
      hintLevel: updateData.hintLevel ?? result.hintLevel,
      aiResponse: result.aiResponse,
      conversationHistory: result.conversationHistory,
      status: updateData.status || result.status || session.status,
      evaluation: (result.status === "completed" || result.currentPhase === "END") ? result.evaluation : undefined,
    });
  } catch (error) {
    console.log("sendMessage error:", error);
    if (error.code === "INVALID_TRANSITION") {
      return res.status(400).json({
        success: false,
        message: error.message,
        code: "INVALID_TRANSITION",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const SUPPORTED_LANGUAGES = ["javascript", "python", "java", "cpp"];

// ===================================
// Update Candidate Code (Persistence & Autosave)
// ===================================

const updateCandidateCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { programmingLanguage, candidateCode } = req.body;

    if (candidateCode !== undefined && typeof candidateCode !== "string") {
      return res.status(400).json({
        success: false,
        message: "candidateCode must be a string",
      });
    }

    if (candidateCode && candidateCode.length > 100000) {
      return res.status(400).json({
        success: false,
        message: "candidateCode exceeds maximum allowed size (100,000 characters)",
      });
    }

    if (programmingLanguage && !SUPPORTED_LANGUAGES.includes(programmingLanguage.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Unsupported programming language: '${programmingLanguage}'. Supported: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    const session = await interviewService.getSession(id, userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "DSA interview not found or unauthorized",
      });
    }

    if (session.status === "completed" || session.currentPhase === "END") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify code for a completed interview",
      });
    }

    if (session.status === "abandoned") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify code for an abandoned interview",
      });
    }

    const updatePayload = {
      lastCodeSavedAt: new Date(),
      executionStatus: "saved",
      codeVersion: (session.codeVersion || 1) + 1,
    };

    if (candidateCode !== undefined) {
      updatePayload.candidateCode = candidateCode;
    }
    if (programmingLanguage) {
      updatePayload.programmingLanguage = programmingLanguage.toLowerCase();
    }

    const updated = await interviewService.updateSession(session._id, updatePayload);
    await safeRedis.del(`dsa-interviews:${userId}`);

    return res.status(200).json({
      success: true,
      message: "Code saved successfully",
      programmingLanguage: updated.programmingLanguage,
      candidateCode: updated.candidateCode,
      codeVersion: updated.codeVersion,
      lastCodeSavedAt: updated.lastCodeSavedAt,
      executionStatus: updated.executionStatus,
    });
  } catch (error) {
    console.log("updateCandidateCode error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Request Code Execution (Run / Submit Event Architecture)
// ===================================

const requestExecution = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { executionMode, programmingLanguage, candidateCode } = req.body;

    if (!executionMode || !["run", "submit"].includes(executionMode)) {
      return res.status(400).json({
        success: false,
        message: "executionMode must be either 'run' or 'submit'",
      });
    }

    if (programmingLanguage && !SUPPORTED_LANGUAGES.includes(programmingLanguage.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Unsupported programming language: '${programmingLanguage}'`,
      });
    }

    const session = await interviewService.getSession(id, userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "DSA interview not found or unauthorized",
      });
    }

    if (session.status === "completed" || session.currentPhase === "END") {
      return res.status(400).json({
        success: false,
        message: "Cannot execute code for a completed interview",
      });
    }

    const lang = (programmingLanguage || session.programmingLanguage || "javascript").toLowerCase();
    const code = candidateCode !== undefined ? candidateCode : (session.candidateCode || "");

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cannot execute empty code",
      });
    }

    // Trigger secure isolated execution via ExecutionService
    const execution = await executionService.createExecution({
      interviewId: session._id,
      userId,
      problemId: session.problemId?._id || session.problemId,
      executionMode,
      programmingLanguage: lang,
      candidateCode: code,
    });

    await safeRedis.del(`dsa-interviews:${userId}`);

    // Return execution_pending contract response with executionId for polling
    return res.status(202).json({
      success: true,
      status: "execution_pending",
      executionId: execution.executionId,
      message:
        executionMode === "run"
          ? "Run request created. Evaluating visible test cases in secure sandbox."
          : "Submit request created. Evaluating full test suite in secure sandbox.",
      executionRequest: {
        interviewId: session._id,
        executionId: execution.executionId,
        executionMode: executionMode,
        programmingLanguage: lang,
        requestedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.log("requestExecution error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Get Execution Status & Results
// ===================================

const getExecutionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id, executionId } = req.params;

    const execution = await executionService.getExecutionStatus(executionId, userId);
    if (!execution) {
      return res.status(404).json({
        success: false,
        message: "Execution record not found",
      });
    }

    // If completed or failed, fetch updated interview state for frontend sync
    let interviewState = null;
    if (execution.status !== "running" && execution.status !== "queued") {
      const interview = await interviewService.getSession(id, userId);
      if (interview) {
        interviewState = {
          currentPhase: interview.currentPhase,
          lastAction: interview.lastAction,
          conversationHistory: interview.conversationHistory,
          testResults: interview.testResults,
          testsPassed: interview.testsPassed,
          debuggingAttempts: interview.debuggingAttempts,
        };
      }
    }

    return res.status(200).json({
      success: true,
      executionId: execution._id,
      status: execution.status,
      executionMode: execution.executionMode,
      programmingLanguage: execution.programmingLanguage,
      result: execution.result,
      interview: interviewState,
    });
  } catch (error) {
    console.log("getExecutionStatus error:", error);
    if (error.statusCode === 403) {
      return res.status(403).json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startDSAInterview,
  getDSAInterview,
  sendMessage,
  updateCandidateCode,
  requestExecution,
  getExecutionStatus,
  SUPPORTED_LANGUAGES,
};


