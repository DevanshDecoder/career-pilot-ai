const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const { users } = require("../store/mockStore");
const { JWT_SECRET, authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({ 
          error: "An account with this email is already registered.", 
          code: "USER_ALREADY_EXISTS" 
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email: cleanEmail,
        passwordHash,
        targetRole: targetRole || "Fullstack Engineer",
        resumeScore: 0,
        interviewScore: 0,
        roadmapProgress: 0,
        completedNodes: []
      });

      const token = jwt.sign(
        { id: newUser._id.toString(), email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          targetRole: newUser.targetRole,
          resumeScore: newUser.resumeScore || 0,
          interviewScore: newUser.interviewScore || 0,
          roadmapProgress: newUser.roadmapProgress || 0,
          completedNodes: newUser.completedNodes || [],
          lastResumeAnalysis: newUser.lastResumeAnalysis || null
        }
      });
    } else {
      // Memory Store Fallback
      const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        return res.status(409).json({ 
          error: "An account with this email is already registered.", 
          code: "USER_ALREADY_EXISTS" 
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        id: "usr_" + Date.now(),
        name,
        email: cleanEmail,
        passwordHash,
        targetRole: targetRole || "Fullstack Engineer",
        resumeScore: 0,
        interviewScore: 0,
        roadmapProgress: 0,
        completedNodes: [],
        lastResumeAnalysis: null,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          targetRole: newUser.targetRole,
          resumeScore: newUser.resumeScore,
          interviewScore: newUser.interviewScore,
          roadmapProgress: newUser.roadmapProgress,
          completedNodes: newUser.completedNodes,
          lastResumeAnalysis: newUser.lastResumeAnalysis
        }
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          targetRole: user.targetRole || "Fullstack Engineer",
          resumeScore: user.resumeScore || 0,
          interviewScore: user.interviewScore || 0,
          roadmapProgress: user.roadmapProgress || 0,
          completedNodes: user.completedNodes || [],
          lastResumeAnalysis: user.lastResumeAnalysis || null
        }
      });
    } else {
      // Memory Store Fallback
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = user.passwordHash.includes("mockhash")
        ? true
        : await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole || "Fullstack Engineer",
          resumeScore: user.resumeScore || 0,
          interviewScore: user.interviewScore || 0,
          roadmapProgress: user.roadmapProgress || 0,
          completedNodes: user.completedNodes || [],
          lastResumeAnalysis: user.lastResumeAnalysis || null
        }
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
});

// Update User Stats (resumeScore, interviewScore, roadmapProgress, completedNodes)
router.post("/update-stats", authenticateToken, async (req, res) => {
  try {
    const { resumeScore, interviewScore, roadmapProgress, completedNodes, lastResumeAnalysis, targetRole } = req.body;
    const userId = req.user.id;

    if (isMongoConnected()) {
      const updateFields = {};
      if (typeof resumeScore === "number") updateFields.resumeScore = resumeScore;
      if (typeof interviewScore === "number") updateFields.interviewScore = interviewScore;
      if (typeof roadmapProgress === "number") updateFields.roadmapProgress = roadmapProgress;
      if (Array.isArray(completedNodes)) updateFields.completedNodes = completedNodes;
      if (lastResumeAnalysis) updateFields.lastResumeAnalysis = lastResumeAnalysis;
      if (targetRole) updateFields.targetRole = targetRole;

      const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true }).select("-passwordHash");
      if (!updatedUser) return res.status(404).json({ error: "User not found" });

      return res.json({
        success: true,
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          targetRole: updatedUser.targetRole,
          resumeScore: updatedUser.resumeScore,
          interviewScore: updatedUser.interviewScore,
          roadmapProgress: updatedUser.roadmapProgress,
          completedNodes: updatedUser.completedNodes,
          lastResumeAnalysis: updatedUser.lastResumeAnalysis
        }
      });
    } else {
      const user = users.find(u => u.id === userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (typeof resumeScore === "number") user.resumeScore = resumeScore;
      if (typeof interviewScore === "number") user.interviewScore = interviewScore;
      if (typeof roadmapProgress === "number") user.roadmapProgress = roadmapProgress;
      if (Array.isArray(completedNodes)) user.completedNodes = completedNodes;
      if (lastResumeAnalysis) user.lastResumeAnalysis = lastResumeAnalysis;
      if (targetRole) user.targetRole = targetRole;

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          resumeScore: user.resumeScore,
          interviewScore: user.interviewScore,
          roadmapProgress: user.roadmapProgress,
          completedNodes: user.completedNodes,
          lastResumeAnalysis: user.lastResumeAnalysis
        }
      });
    }
  } catch (err) {
    console.error("Error updating stats:", err);
    return res.status(500).json({ error: "Failed to update user statistics" });
  }
});

// Get Current User Profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user.id).select("-passwordHash");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          resumeScore: user.resumeScore || 0,
          interviewScore: user.interviewScore || 0,
          roadmapProgress: user.roadmapProgress || 0,
          completedNodes: user.completedNodes || [],
          lastResumeAnalysis: user.lastResumeAnalysis || null,
          createdAt: user.createdAt
        }
      });
    } else {
      const user = users.find(u => u.id === req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole || "Fullstack Engineer",
          resumeScore: user.resumeScore || 0,
          interviewScore: user.interviewScore || 0,
          roadmapProgress: user.roadmapProgress || 0,
          completedNodes: user.completedNodes || [],
          lastResumeAnalysis: user.lastResumeAnalysis || null,
          createdAt: user.createdAt
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error fetching user profile" });
  }
});

module.exports = router;
