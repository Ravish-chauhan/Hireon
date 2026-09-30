const { DSAInterview } = require("../models/dsaInterview.model");

// ===================================
// DSA Interview Service
// ===================================
// Abstraction layer for DSA interview session management.

/**
 * Create a new DSA interview session.
 * Sessions start in the canonical 'START' phase.
 */
async function createSession({ userId, problemId, programmingLanguage }) {
  const session = await DSAInterview.create({
    userId,
    problemId,
    programmingLanguage: programmingLanguage || "javascript",
    currentPhase: "START",
    status: "in-progress",
    startedAt: new Date(),
  });

  return session;
}

/**
 * Get a session by ID, ensuring it belongs to the user.
 */
async function getSession(interviewId, userId) {
  return DSAInterview.findOne({
    _id: interviewId,
    userId,
  }).populate("problemId");
}

/**
 * Update a session with new data from graph execution.
 */
async function updateSession(interviewId, updateData) {
  return DSAInterview.findByIdAndUpdate(interviewId, updateData, {
    new: true,
  }).populate("problemId");
}

/**
 * Get all DSA interview sessions for a user.
 */
async function getUserSessions(userId) {
  return DSAInterview.find({ userId })
    .populate("problemId", "title slug difficulty topics")
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = {
  createSession,
  getSession,
  updateSession,
  getUserSessions,
};
