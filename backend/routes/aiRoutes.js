const express = require("express");
const { 
  analyzeResume, 
  generateInterviewQuestions, 
  evaluateAnswer, 
  generateRoadmap 
} = require("../services/aiEngine");
const { resumes, interviewSessions, roadmaps } = require("../store/mockStore");

const router = express.Router();

// Analyze Resume
router.post("/analyze-resume", (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: "Please provide a valid resume content (minimum 20 characters)" });
    }

    const role = targetRole || "Fullstack Engineer";
    const analysis = analyzeResume(resumeText, role);

    const record = {
      id: "res_" + Date.now(),
      targetRole: role,
      score: analysis.score,
      analysis,
      createdAt: new Date().toISOString()
    };
    resumes.push(record);

    return res.json({
      success: true,
      data: record
    });
  } catch (err) {
    return res.status(500).json({ error: "Error analyzing resume" });
  }
});

// Generate Interview Questions
router.post("/interview-questions", (req, res) => {
  try {
    const { role, category, count } = req.body;
    const questions = generateInterviewQuestions(role || "Fullstack Engineer", category, count || 4);
    return res.json({
      success: true,
      role: role || "Fullstack Engineer",
      questions
    });
  } catch (err) {
    return res.status(500).json({ error: "Error generating interview questions" });
  }
});

// Evaluate Interview Answer
router.post("/evaluate-answer", (req, res) => {
  try {
    const { questionId, questionText, userAnswer } = req.body;
    if (!userAnswer || userAnswer.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a valid answer response" });
    }

    const evaluation = evaluateAnswer(questionId, questionText, userAnswer);
    
    const session = {
      id: "int_" + Date.now(),
      questionId,
      questionText,
      userAnswer,
      evaluation,
      createdAt: new Date().toISOString()
    };
    interviewSessions.push(session);

    return res.json({
      success: true,
      data: session
    });
  } catch (err) {
    return res.status(500).json({ error: "Error evaluating answer" });
  }
});

// Generate Roadmap
router.post("/generate-roadmap", (req, res) => {
  try {
    const { role, timeframe } = req.body;
    const roadmap = generateRoadmap(role || "Fullstack Engineer", timeframe || "3 Months");

    const record = {
      id: "rdm_" + Date.now(),
      roadmap,
      createdAt: new Date().toISOString()
    };
    roadmaps.push(record);

    return res.json({
      success: true,
      data: record
    });
  } catch (err) {
    return res.status(500).json({ error: "Error generating career roadmap" });
  }
});

module.exports = router;
