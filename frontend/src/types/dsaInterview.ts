// ===================================
// DSA Interview Types
// ===================================

// --- Phase Enum ---
export type DSAPhase =
  | "START"
  | "INTRODUCTION"
  | "PROBLEM_PRESENTATION"
  | "UNDERSTANDING"
  | "APPROACH_DISCUSSION"
  | "APPROACH_REVIEW"
  | "CODING"
  | "TESTING"
  | "DEBUGGING"
  | "COMPLEXITY"
  | "FINAL_EVALUATION"
  | "END";

// --- Interview Status ---
export type DSAInterviewStatus = "in-progress" | "completed" | "abandoned";

// --- Difficulty ---
export type DSADifficulty = "easy" | "medium" | "hard";

// --- Conversation Message ---
export interface DSAMessage {
  role: "interviewer" | "candidate";
  content: string;
  phase: DSAPhase;
  timestamp: string;
}

// --- Test Case ---
export interface DSATestCase {
  input: string;
  output: string;
  explanation?: string;
}

// --- Starter Code ---
export interface DSAStarterCode {
  language: string;
  code: string;
}

// --- Problem ---
export interface DSAProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: DSADifficulty;
  topics: string[];
  description: string;
  constraints: string[];
  examples: DSATestCase[];
  expectedApproaches: string[];
  optimalApproach: string;
  timeComplexity: string;
  spaceComplexity: string;
  starterCode: DSAStarterCode[];
  hints: string[];
  visibleTestCases: DSATestCase[];
}

// --- Test Result ---
export interface DSATestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

// --- Evaluation ---
export interface DSAEvaluation {
  problemSolving: number;
  codeQuality: number;
  communication: number;
  debugging: number;
  optimization: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  recommendation: string;
}

// --- Supported Languages ---
export type DSALanguage = 'javascript' | 'python' | 'java' | 'cpp';

// --- DSA Interview Session ---
export interface DSAInterview {
  _id: string;
  userId: string;
  problemId: DSAProblem;
  currentPhase: DSAPhase;
  lastAction?: string;
  conversationHistory: DSAMessage[];
  candidateApproach: string;
  approachStatus: string;
  hintsUsed: number;
  hintLevel: number;
  programmingLanguage: DSALanguage | string;
  candidateCode: string;
  codeVersion?: number;
  lastCodeSavedAt?: string | null;
  executionStatus?: 'idle' | 'saving' | 'saved' | 'pending';
  lastExecutionRequest?: any;
  testResults: DSATestResult[];
  debuggingAttempts: number;
  timeComplexity: string;
  spaceComplexity: string;
  evaluation: DSAEvaluation;
  status: DSAInterviewStatus;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- API Payloads ---

export interface StartDSAInterviewRequest {
  difficulty?: DSADifficulty;
  topics?: string[];
  programmingLanguage?: string;
  problemSlug?: string;
}

export interface StartDSAInterviewResponse {
  success: boolean;
  interviewId: string;
  currentPhase: DSAPhase;
  lastAction?: string;
  approachStatus?: string;
  hintsUsed?: number;
  hintLevel?: number;
  aiResponse: string;
  conversationHistory: DSAMessage[];
  problem: {
    title: string;
    slug: string;
    difficulty: DSADifficulty;
    topics: string[];
  };
}

export interface SendDSAMessageRequest {
  message?: string;
  code?: string;
  action?: string;
}

export interface SendDSAMessageResponse {
  success: boolean;
  currentPhase: DSAPhase;
  lastAction?: string;
  approachStatus?: string;
  hintsUsed?: number;
  hintLevel?: number;
  aiResponse: string;
  conversationHistory: DSAMessage[];
  status: DSAInterviewStatus;
  evaluation?: DSAEvaluation;
}

export interface GetDSAInterviewResponse {
  success: boolean;
  interview: DSAInterview;
}

export interface SaveDSACodeRequest {
  programmingLanguage?: string;
  candidateCode?: string;
}

export interface SaveDSACodeResponse {
  success: boolean;
  message: string;
  programmingLanguage: string;
  candidateCode: string;
  codeVersion: number;
  lastCodeSavedAt: string;
  executionStatus: 'idle' | 'saving' | 'saved' | 'pending';
}

export interface ExecuteDSACodeRequest {
  executionMode: 'run' | 'submit';
  programmingLanguage?: string;
  candidateCode?: string;
}

export interface ExecuteDSACodeResponse {
  success: boolean;
  status: string;
  executionId?: string;
  message: string;
  executionRequest: {
    interviewId: string;
    executionId?: string;
    executionMode: 'run' | 'submit';
    programmingLanguage: string;
    requestedAt: string;
  };
}

export interface DSATestResultItem {
  testNumber: number;
  passed: boolean;
  status: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  timeMs: number;
  memoryKb?: number;
  error?: string | null;
  isHidden?: boolean;
}

export interface DSAExecutionNormalizedResult {
  status: string;
  executionId: string;
  executionMode: 'run' | 'submit';
  programmingLanguage: string;
  testsPassed: number;
  testsTotal: number;
  testResults: DSATestResultItem[];
  compileError?: string | null;
  runtimeError?: string | null;
  timeMs: number;
  memoryKb?: number;
}

export interface GetDSAExecutionResponse {
  success: boolean;
  executionId: string;
  status: string;
  executionMode: 'run' | 'submit';
  programmingLanguage: string;
  result?: DSAExecutionNormalizedResult | null;
  interview?: {
    currentPhase: DSAPhase;
    lastAction?: string;
    conversationHistory: DSAMessage[];
    testResults: any[];
    testsPassed: boolean;
    debuggingAttempts: number;
  } | null;
}


