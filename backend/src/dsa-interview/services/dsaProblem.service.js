const DSAProblem = require("../models/dsaProblem.model");

// ===================================
// DSA Problem Service
// ===================================
// Abstraction layer for problem retrieval.
// Currently backed by MongoDB (manual seed data).
// Later replaceable with LeetCode API / external imports
// without changing the interface.

/**
 * Get a random problem, optionally filtered by difficulty and/or topics.
 */
async function getRandomProblem({ difficulty, topics } = {}) {
  const filter = {};

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (topics && topics.length > 0) {
    filter.topics = { $in: topics };
  }

  const count = await DSAProblem.countDocuments(filter);

  if (count === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * count);
  const problem = await DSAProblem.findOne(filter).skip(randomIndex).lean();

  return problem;
}

/**
 * Get a specific problem by ID.
 */
async function getProblemById(problemId) {
  return DSAProblem.findById(problemId).lean();
}

/**
 * Get a specific problem by slug.
 */
async function getProblemBySlug(slug) {
  return DSAProblem.findOne({ slug }).lean();
}

/**
 * Get all problems, optionally filtered.
 */
async function getAllProblems({ difficulty, topics } = {}) {
  const filter = {};

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (topics && topics.length > 0) {
    filter.topics = { $in: topics };
  }

  return DSAProblem.find(filter).sort({ difficulty: 1, title: 1 }).lean();
}

module.exports = {
  getRandomProblem,
  getProblemById,
  getProblemBySlug,
  getAllProblems,
};
