const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const {
  startInterview,
  submitAnswer,
  getInterview,
  getAllInterviews,
} = require("../controllers/interview.controller");

const interviewRouter = express.Router();

// All interview routes require authentication
interviewRouter.use(authenticateToken);

interviewRouter.post("/start", startInterview);
interviewRouter.post("/answer", submitAnswer);
interviewRouter.get("/all", getAllInterviews);
interviewRouter.get("/:id", getInterview);

module.exports = interviewRouter;
