const express = require("express");
const mongoose = require("mongoose");
const { authenticateToken } = require("../../middleware/auth");
const {
  startDSAInterview,
  getDSAInterview,
  sendMessage,
  updateCandidateCode,
  requestExecution,
  getExecutionStatus,
} = require("../controllers/dsaInterview.controller");

const dsaInterviewRouter = express.Router();

// Middleware: Authenticate token, with seamless dev fallback for local testing
const dsaAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      req.user = {
        _id: new mongoose.Types.ObjectId("000000000000000000000001"),
        fullName: "Dev Candidate",
        email: "dev@hireon.local",
      };
      return next();
    }
    return res.status(401).json({ error: "Access token required" });
  }

  return authenticateToken(req, res, next);
};

dsaInterviewRouter.use(dsaAuth);

// POST /api/dsa-interview/start — Start a new DSA interview
dsaInterviewRouter.post("/start", startDSAInterview);

// GET /api/dsa-interview/:id — Get interview session details
dsaInterviewRouter.get("/:id", getDSAInterview);

// POST /api/dsa-interview/:id/message — Send a message in the interview
dsaInterviewRouter.post("/:id/message", sendMessage);

// PATCH /api/dsa-interview/:id/code — Persist / autosave candidate code
dsaInterviewRouter.patch("/:id/code", updateCandidateCode);

// POST /api/dsa-interview/:id/execute — Create an execution request (run / submit)
dsaInterviewRouter.post("/:id/execute", requestExecution);

// GET /api/dsa-interview/:id/execution/:executionId — Get execution status and results
dsaInterviewRouter.get("/:id/execution/:executionId", getExecutionStatus);

module.exports = dsaInterviewRouter;


